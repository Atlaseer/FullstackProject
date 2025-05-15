import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to require login from JWT in cookies (copied from posts.js)
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

// Create new comment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content is required' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const newComment = new Comment({
      post: postId,
      user: req.user.id,
      content,
    });
    await newComment.save();
    post.totalComments = (post.totalComments || 0) + 1;
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

// Get all comments for a post by postID
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ error: 'Post ID required' });
    }
    const comments = await Comment.find({ post: postId }).populate('user', 'username');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

// Edit a comment by ID, if authorized
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
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

// Delete a comment by ID
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
    await comment.remove();
    const post = await Post.findById(comment.post);
    if (post) {
      post.totalComments = Math.max((post.totalComments || 1) - 1, 0);
      await post.save();
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

export default router;
