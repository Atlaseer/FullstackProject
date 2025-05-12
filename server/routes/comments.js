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

//Get all comments for a post by postID
route.get('/', async (req, res) => {
    try {
        const {postId} = req.params;

        //Validates postID
        if (!postId){
            return res.status(400).json({ error: 'Post ID required'})
        }

        const comments = await Comment.find({ post: postId }).populate('user', 'username');
        res.status(200).json(comments);
    } catch (error){
        res.status(500).json({ error: 'Server Error: ${error.message}' });

    }
})

//Edit a comment by ID, if authorized
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body;

        if (!content){
            return res.status(400).json({ error: 'Content is required'});
        }

        const comment = await Comment.findById(id);
        if (!comment){
            return res.status(404).json({ error: 'Comment not found'});
        }

        if (comment.user.toString() !== req.user.id){
            return res.status(403).json({ error: 'Not authorized to edit this comment'});
        }

        comment.content.save();
        await comment.save()

        res.status(200).json(comment);

    } catch (error) {
        res.status(500).json({ error: 'Server Error: ${error.message}' });
    }
})


//Delete a comment by ID
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment){
            return res.status(404).json({ error: 'Comment not found'})
        }

        if(comment.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this comment'});
        }

        await comment.remove();

        const post = await Post.findById(comment.post);
        if (post) {
            post.totalComments = (Math.max((post.totalComments || 1) - 1, 0));
            await post.save();
        }

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occured' });
    }
})

export default router;
