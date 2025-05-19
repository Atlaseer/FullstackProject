import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaReply, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Comment = ({ comment, onReply, user }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState(comment.likes ?? 0);
  const [dislikes, setDislikes] = useState(comment.dislikes ?? 0);

  const totalVotes = likes + dislikes;
  const likeRatio = totalVotes ? (likes / totalVotes) * 100 : 50;

    // Helper to format like counts
    const formatCount = (n) => {
      if (n < 1000) return `${n}`;
      if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
      if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
      return `${(n / 1_000_000_000).toFixed(1)}b`;
    };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await onReply(replyText, comment._id);
    setReplyText('');
    setShowReplyInput(false);
  };

  const handleVote = async (type) => {
    try {
      const res = await axios.post(
        `${VITE_SERVER_URL}/api/comments/${comment._id}/vote`,
        { type },
        { withCredentials: true }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <div className="comment-item">
      <p><strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.content}</p>
      <div className="comment-meta">{new Date(comment.createdAt).toLocaleString()}</div>

      <div className="comment-controls">
        <div className="vote-bar">
          <div className="vote-ratio" style={{ width: `${likeRatio}%` }}></div>
        </div>
        <div className="vote-buttons">
          <button onClick={() => handleVote('like')} className="vote-button">
            <FaThumbsUp /> {formatCount(likes ?? 0)}
          </button>
          <button onClick={() => handleVote('dislike')} className="vote-button">
            <FaThumbsDown /> {formatCount(dislikes ?? 0)}
          </button>
        </div>
      </div>

      {user && (
        <button className="reply-button" onClick={() => setShowReplyInput((prev) => !prev)}>
          <FaReply /> Reply
        </button>
      )}

      {showReplyInput && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              onReply={onReply}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;