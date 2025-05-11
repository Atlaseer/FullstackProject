import mongoose from 'mongoose';
import User from './User.js';
import Comment from './Comment.js';

//import Category from "./Category.js";
//import Tag from "./Tag.js";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: null },
  tags: { type: [String], ref: 'Tag' },
  categories: { type: [String], ref: 'Category' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 }
    }],

  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  views: { type: Number, default: 0 }

},

  { timestamps: true }
);

postSchema.methods.updateAverageRating = function () {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
};

postSchema.methods.incrementViews = function () {
  this.views = (this.views || 0) + 1;
  return this.save();
};

const Post = mongoose.model('Post', postSchema);
export default Post;
