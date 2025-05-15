import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostComments = ({ postId, comments: initialComments = [], user }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch comments on mount or when postId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/comments/post/${postId}`
        );
        setComments(res.data);
      } catch (err) {
        setComments([]);
      }
    };
    if (postId) fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `http://localhost:3000/api/comments/`,
        { postId, content: commentText },
        { withCredentials: true }
      );
      // Fetch user info for the new comment if not present
      const newComment = res.data;
      if (!newComment.user || typeof newComment.user === 'string') {
        // Try to get user from context or fallback
        newComment.user = user ? { username: user.username } : { username: 'You' };
      }
      setComments((prev) => [...prev, newComment]);
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
          <li key={c._id || c.createdAt} className="comment-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>{c.user?.username || 'Anonymous'}:</strong> {c.content}
            </span>
            <span style={{ fontSize: '0.9em', color: '#888', marginLeft: 12 }}>
              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
            </span>
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
