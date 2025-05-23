import React from 'react';
import '../styles/Main.css';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const PostCard = ({ post }) => {
  if (!post) return null;
  return (
    <div className="post-card">
      <h3>
        <Link to={`/post/${post._id}`}>{post.title || 'Untitled'}</Link>
      </h3>
      <div className="post-meta">
        <span>By {post.user?.username || 'Unknown'}</span>
        <span>{post.totalComments ?? 0} comments</span>
      </div>
      <StarRating stars={post.averageRating || 0} />
      <span className='post-views'>{post?.views ?? 0} views</span>
    </div>
  );
};

export default PostCard;
