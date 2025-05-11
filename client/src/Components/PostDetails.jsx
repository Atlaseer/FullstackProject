import React from 'react';
import { Link } from 'react-router-dom';
import PostContent from './PostContent';
import StarRating from './StarRating';

const PostDetails = ({ post, user, rating, handleRatingChange }) => (
  <div className="post-card">
    <h2>{post.title}</h2>
    <p className="post-meta">
      <strong>Category:</strong> {post.categories?.join(', ') || 'None'}
    </p>
    <PostContent content={post.content} />
    <p className="post-meta">
      <em>
        By: {post.user?.username ? (
          <Link to={`/profile/${post.user.username}`}>{post.user.username}</Link>
        ) : 'Unknown'}{' '}
        <StarRating
          stars={rating}
          onRate={user ? handleRatingChange : null}
        />
        <span style={{ fontSize: '0.85rem', marginLeft: '8px' }}>
          {post.totalRatings || 0} {post.totalRatings === 1 ? 'rating' : 'ratings'}
        </span>
      </em>
    </p>
  </div>
);

export default PostDetails;