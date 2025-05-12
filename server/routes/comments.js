import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//Create new comment
router.post('/', verifyToken, async (req, res)=> {
    try {
        const { postId, content } = req.body;

        //Checks required fields
        if(!postId || !content) {
            return res.status(500).json({ error: 'Post ID and content is required'})
        }

        const post = await Post.findById(postId);
        if (!post){
            return res.status(404).json({ error: 'Post not found'})
        }

        //Create and save new comment, uses UserId from JWT token
        const newComment = new Comment({
            post: postId,
            user: req.user.id,
            content,
        });

        await newComment.save();

        post.totalComments = (post.totalComments || 0) +1
        await post.save();

        res.status(201).json(newComment)
    }catch (error) {
        res.status(500).json({ error: 'Server Error: ${error.message}' });
    }
})
