import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaReply } from 'react-icons/fa';

const PostComments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/comments/post/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to load comments');
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
        {
          postId,
          content: commentText,
          parent: replyingTo || null,
        },
        { withCredentials: true }
      );

      const newComment = res.data;
      if (!newComment.user || typeof newComment.user === 'string') {
        newComment.user = user ? { username: user.username } : { username: 'You' };
      }

      setComments(prev => [...prev, newComment]);
      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      setError('Failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setCommentText('');
  };

  const renderReplies = (parentId) => {
    return comments
      .filter(c => c.parent === parentId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(reply => (
        <div key={reply._id} className="comment-reply">
          <div className="comment-content">
            <strong>{reply.user?.username || 'Anonymous'}</strong>: {reply.content}
          </div>
          <div className="comment-meta">
            {new Date(reply.createdAt).toLocaleString()}
          </div>
          {user && (
            <button className="reply-button" onClick={() => handleReply(reply._id)}>
              <FaReply /> Reply
            </button>
          )}
          {renderReplies(reply._id)}
        </div>
      ));
  };

  return (
    <div className="post-comments-section">
      <h4>Comments</h4>

      {comments.length === 0 && <p>No comments yet.</p>}

      <ul className="comments-list">
        {comments
          .filter((c) => !c.parent)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((comment) => (
            <li key={comment._id} className="comment-item">
              <div className="comment-content">
                <strong>{comment.user?.username || 'Anonymous'}</strong>: {comment.content}
              </div>
              <div className="comment-meta">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
              {user && (
                <button className="reply-button" onClick={() => handleReply(comment._id)}>
                  <FaReply /> Reply
                </button>
              )}
              {renderReplies(comment._id)}
            </li>
          ))}
      </ul>

      {user && (
        <form className="add-comment-form" onSubmit={handleAddComment}>
          {replyingTo && (
            <p className="replying-indicator">
              Replying to comment...{' '}
              <button type="button" onClick={() => setReplyingTo(null)} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </p>
          )}
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
