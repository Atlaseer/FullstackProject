import mongoose from 'mongoose';
import User from './User.js';
import Comment from './Comment.js';

//import { Category } from "./Category.js";
//import { Tag } from "./Tag.js";

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], ref: 'Tag' },
    categories: { type: [String], ref: 'Category' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
