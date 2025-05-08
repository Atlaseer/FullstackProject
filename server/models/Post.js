import mongoose from "mongoose";
import User from "./User.js";
//import { Comment } from "./Comment.js";
//import { Category } from "./Category.js";
//import { Tag } from "./Tag.js";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], ref: "Tag" },
    categories: { type: [String], ref: "Category" },

    }
    );