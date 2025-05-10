import express from 'express';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ Middleware to require login from JWT in cookies
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

// ✅ Create new post (auth required)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body;
    const userId = req.user.id;

    const newPost = new Post({
      user: userId,
      title,
      content,
      tags,
      categories,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Rate post (auth required)
router.post('/:id/rate', requireAuth, async (req, res) => {
  const { rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existing = post.ratings.find((r) => r.user.toString() === userId);

    if (existing) {
      existing.rating = rating;
    } else {
      post.ratings.push({ user: userId, rating });
      post.totalRatings = post.ratings.length;
    }

    post.updateAverageRating();
    await post.save();

    res.status(200).json({
      message: 'Rating updated',
      averageRating: post.averageRating,
      totalRatings: post.totalRatings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rate post' });
  }
});

// ✅ Update post by ID (auth required)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, categories },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete post by ID (auth required)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔓 Public: Get paginated posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username')
      .populate('comments');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔓 Public: Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate('comments');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
