import React from 'react';
import '../styles/Main.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <div className="post-meta">
        <span>By {post.author}</span>
        <span>{post.replies} replies</span>
      </div>
    </div>
  );
};

export default PostCard;
