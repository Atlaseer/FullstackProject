import React from 'react';
import '../styles/Main.css';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h3> <Link to={`/post/${post.id}`}>{post.title} </Link></h3>
      <div className="post-meta">
        <span>By {post.author}</span>
        <span>{post.replies || 0} replies</span>
      </div>
    </div>
  );
};

export default PostCard;
