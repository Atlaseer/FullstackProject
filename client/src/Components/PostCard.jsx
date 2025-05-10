import React from 'react';
import '../styles/Main.css';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h3> <Link to={`/post/${post._id}`}>{post.title} </Link></h3>
      <div className="post-meta">
        <span>By {post.user?.username || 'Unkown'}</span>
        <span>{post.comments || 0} comments</span>
      </div>
      <StarRating stars={post.averageRating}/>
    </div>
  );
};

export default PostCard;
