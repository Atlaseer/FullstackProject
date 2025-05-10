import express from 'express';
import Post from '.models/Post.js'

const router = express.Router();

//Creates new post
router.post('/', async (req, res) => {
    try {
        const {user, title, content, tags, categories } = req.body;
        const newPost = new Post({ user, title, content, tags, categories });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Gets all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username').populate('comments');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Gets post by ID
router. get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username').populate('comments')
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

//Updates post by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, categories } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, tags, categories },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json ({ message: 'Post not found'});
        res.status(200).json(updatedPost);
    
        } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

