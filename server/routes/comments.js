import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

//Middleware to verify JWT token
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

//Create a comment or a reply
router.post('/', requireAuth, async (req, res) => {
  try {
    const { postId, content, parent = null } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment) {
        return res.status(400).json({ error: 'Parent comment not found' });
      }
    }

    const newComment = new Comment({
      post: postId,
      user: req.user.id,
      content,
      parent: parent || null,
    });

    await newComment.save();
    post.totalComments = (post.totalComments || 0) + 1;
    await post.save();

    const populated = await newComment.populate('user', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

//Get all comments for a post (flat list)
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

//Update a comment
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    comment.content = content;
    await comment.save();

    const populated = await comment.populate('user', 'username');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

//Delete a comment
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.deleteMany({ parent: comment._id }); // delete all replies
    await comment.deleteOne();

    const post = await Post.findById(comment.post);
    if (post) {
      post.totalComments = Math.max((post.totalComments || 1) - 1, 0);
      await post.save();
    }

    res.status(200).json({ message: 'Comment and any replies deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

// POST /api/comments/:id/vote (dislikes/likes)
router.post('/:id/vote', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Remove existing vote if exists
    comment.likes = comment.likes.filter(uid => uid.toString() !== userId);
    comment.dislikes = comment.dislikes.filter(uid => uid.toString() !== userId);

    // Add new vote
    if (type === 'like') {
      comment.likes.push(userId);
    } else if (type === 'dislike') {
      comment.dislikes.push(userId);
    }

    await comment.save();

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

export default router;
