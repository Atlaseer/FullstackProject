import React, { useState } from 'react';
import axios from 'axios';

const PostComments = ({ postId, comments: initialComments = [], user }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `http://localhost:3000/api/comments`,
        { postId, content: commentText },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch (err) {
      setError('Failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-comments-section">
      <h4>Comments</h4>
      {comments.length === 0 && <p>No comments yet.</p>}
      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c._id || c.createdAt} className="comment-item">
            <strong>{c.user?.username || 'Anonymous'}:</strong> {c.content}
          </li>
        ))}
      </ul>
      {user && (
        <form className="add-comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading || !commentText.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
      {error && <p className="txt-error">{error}</p>}
    </div>
  );
};

export default PostComments;
