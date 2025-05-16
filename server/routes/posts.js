import express from 'express';
import Post from '../models/Post.js'
import jwt from 'jsonwebtoken';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Middleware to require login from JWT in cookies
//Only authorized users may acces certain routes
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

// Lets authenticated users to post
// POST /api/posts/:id/rate
router.post('/:id/rate', requireAuth, async (req, res) => {
  const { rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user has already rated
    const existing = post.ratings.find((r) => r.user.toString() === userId);

    if (existing) {
      existing.rating = rating; // update
    } else {
      post.ratings.push({ user: userId, rating });
      post.totalRatings = post.ratings.length;
    }

    post.updateAverageRating();
    await post.save();

    res.status(200).json({
      message: 'Rating updated',
      averageRating: post.averageRating,
      totalRatings: post.totalRatings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rate post' });
  }
});

//Creates new post with cover image upload
router.post('/', requireAuth, upload.single('coverImage'), async (req, res) => {
  try {
    // Get the user ID from the token
    const userId = req.user.id;
    const { title, content, tags, categories } = req.body;
    // Preparing post data
    const postData = {
      user: userId,
      title,
      content,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag =>
        tag.trim()).filter(Boolean) : tags) : [],
      categories: categories ? (typeof categories === 'string' ?
        categories.split(',').map(cat => cat.trim()).filter(Boolean) : categories) : []
    };
    // If you uploaded a cover image, add the image path
    if (req.file) {
      postData.coverImage = `/uploads/${req.file.filename}`;
    }
    const newPost = new Post(postData);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Gets paginated posts, with optional search by title and sorting
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      // default to page 1
    const limit = parseInt(req.query.limit) || 10;   // default to 10 per page
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const sort = req.query.sort || 'alltime'; // alltime, monthly, daily
    const sortBy = req.query.sortBy || 'date'; // 'date' or 'views'
    let query = {};
    if (search) {
      // Case-insensitive partial match for title
      query.title = { $regex: search, $options: 'i' };
    }
    // Date filtering for sort (for date sort only)
    if (sortBy === 'date') {
      if (sort === 'monthly') {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        query.createdAt = { $gte: firstOfMonth };
      } else if (sort === 'daily') {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        query.createdAt = { $gte: startOfDay };
      }
    }
    let posts = await Post.find(query)
      .populate('user', 'username')
      .populate('comments');
    // Sort by views (alltime/monthly/daily)
    if (sortBy === 'views') {
      const now = new Date();
      let sortKey = 'views';
      if (sort === 'daily') {
        const today = now.toISOString().slice(0, 10);
        posts = posts.map(p => ({
          ...p.toObject(),
          _viewsForSort: (p.viewsByDate?.get ? p.viewsByDate.get(today) : p.viewsByDate?.[today]) || 0
        }));
        posts.sort((a, b) => b._viewsForSort - a._viewsForSort);
      } else if (sort === 'monthly') {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const prefix = `${year}-${month}-`;
        posts = posts.map(p => {
          let sum = 0;
          if (p.viewsByDate) {
            const entries = p.viewsByDate instanceof Map ? Array.from(p.viewsByDate.entries()) : Object.entries(p.viewsByDate);
            for (const [date, count] of entries) {
              if (date.startsWith(prefix)) sum += count;
            }
          }
          return { ...p.toObject(), _viewsForSort: sum };
        });
        posts.sort((a, b) => b._viewsForSort - a._viewsForSort);
      } else {
        // alltime
        posts = posts.map(p => ({ ...p.toObject(), _viewsForSort: p.views || 0 }));
        posts.sort((a, b) => b._viewsForSort - a._viewsForSort);
      }
      // Paginate after sorting
      posts = posts.slice(skip, skip + limit);
    } else {
      // Sort by date (default)
      posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      posts = posts.slice(skip, skip + limit);
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Gets all posts by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('comments');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Gets post by ID
//Increments view count
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate('comments');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    //Increments view count
    await post.incrementViews();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//Updates post by ID
// Updates post by ID (only admin or post owner)
router.put('/:id', requireAuth, upload.single('coverImage'), async (req, res) => {
  try {
    const { id: userId, isAdmin } = req.user;
    const { title, content, tags, categories } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // 🔐 Check if user is allowed to edit
    if (!isAdmin && post.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    // Prepare fields to update
    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && {
        tags: typeof tags === 'string'
          ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : tags
      }),
      ...(categories && {
        categories: typeof categories === 'string'
          ? categories.split(',').map(cat => cat.trim()).filter(Boolean)
          : categories
      })
    };

    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Delete a post by ID
//Requires authentication
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' })
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;
