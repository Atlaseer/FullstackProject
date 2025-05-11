import React from 'react';
import { Link } from 'react-router-dom';
import PostContent from './PostContent';
import StarRating from './StarRating';

const formatNumber = (n) => 
{
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Billion';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'Million';
  return n;
}

const PostDetails = ({ post, user, rating, handleRatingChange }) => (
  <div className="post-card">
    <h2>{post.title}</h2>
    <p className="post-meta">
      <strong>Category:</strong> {post.categories?.join(', ') || 'None'}
    </p>
    <PostContent content={post.content} />
    <div className="post-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>
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
      </span>
      <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
        {formatNumber(post.views || 0)} {post.views === 1 ? 'view' : 'views'}
      </span>
    </div>
  </div>
);

export default PostDetails;