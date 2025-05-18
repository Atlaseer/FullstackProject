import React, { useState, useEffect } from 'react';
import axios from 'axios';


const PostComments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${VITE_SERVER_URL}/api/comments/post/${postId}`);
        const all = res.data;

        // Group replies
        const commentMap = {};
        const topLevel = [];

        all.forEach((c) => {
          c.replies = [];
          commentMap[c._id] = c;
        });

        all.forEach((c) => {
          if (c.parent && commentMap[c.parent]) {
            commentMap[c.parent].replies.push(c);
          } else {
            topLevel.push(c);
          }
        });

        // Sort all replies by date
        const sortReplies = (list) => {
          list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          list.forEach((c) => sortReplies(c.replies));
        };

        sortReplies(topLevel);
        setComments(topLevel);
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `${VITE_SERVER_URL}/api/comments/`,
        { postId, content: commentText },
        { withCredentials: true }
      );
      setCommentText('');
      setComments((prev) => [...prev, { ...res.data, replies: [] }]);
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  const handleReply = async (text, parentId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/comments/`,
        { postId, content: text, parent: parentId },
        { withCredentials: true }
      );
      const newReply = res.data;

      const attachReply = (list) =>
        list.map((c) =>
          c._id === parentId
            ? { ...c, replies: [...(c.replies || []), { ...newReply, replies: [] }] }
            : { ...c, replies: attachReply(c.replies || []) }
        );

      setComments((prev) => attachReply(prev));
    } catch (err) {
      setError('Failed to reply.');
    }
  };

  return (
    <div className="post-comments-section">
      <h4>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h4>

      {comments.map((c) => (
        <Comment
          key={c._id}
          comment={c}
          onReply={handleReply}
          user={user}
        />
      ))}

      {user && (
        <form className="add-comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post</button>
        </form>
      )}

      {error && <p className="txt-error">{error}</p>}
    </div>
  );
};

export default PostComments;
