import express from 'express';
import Post from '.models/Post.js'

const router = express.Router();

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

//router.get('/', )