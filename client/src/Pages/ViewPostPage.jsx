import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';
import '../styles/Main.css';
import PostComments from '../Components/PostComments';
import PostDetails from '../Components/PostDetails';
import EditPostForm from '../Components/EditPostForm';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ViewPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${VITE_SERVER_URL}/api/posts/${id}`, { withCredentials: true })
      .then((res) => {
        if (!isMounted) return;
        setPost(res.data);
        setRating(res.data.averageRating || 0);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Post not found.');
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

  const handleRatingChange = useCallback(async (newRating) => {
    setRating(newRating);
    try {
      const res = await axios.post(
        `${VITE_SERVER_URL}/api/posts/${id}/rate`,
        { rating: newRating },
        { withCredentials: true }
      );
      setPost((prev) => ({
        ...prev,
        averageRating: res.data.averageRating,
        totalRatings: res.data.totalRatings,
      }));
    } catch (err) {
      // Optionally show error to user
      setRating(post?.averageRating || 0);
      console.error('Failed to rate post', err);
    }
  }, [id, post]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedPost) => {
    try {
      const res = await axios.put(`${VITE_SERVER_URL}/api/posts/${id}`, updatedPost, {
        withCredentials: true,
      });
      setPost(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update post', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  console.log('Logged-in user ID:', user?.id);
  console.log('Post creator ID:', post?.user?._);

  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <div className="post-list">
          {loading ? (
            <div className="not-found-card"><p>Loading post...</p></div>
          ) : error ? (
            <div className="not-found-card"><p>{error}</p></div>
          ) : (
            <>
              {isEditing ? (
                <EditPostForm post={post} onSave={handleSave} onCancel={handleCancel} />
              ) : (
                <>
                  {post.coverImage && (
                    <div className="post-view-cover">
                      <img
                        src={`${VITE_SERVER_URL}${post.coverImage}`}
                        alt={`${post.title} Cover image of`}
                        className="post-view-cover-image"
                      />
                    </div>
                  )}
                  <PostDetails post={post} user={user} rating={rating} handleRatingChange={handleRatingChange} />
                  {user?.id && post?.user && user.id === post.user._id && (
  <button onClick={handleEdit}>Edit Post</button>
)}

                  <PostComments postId={post._id} comments={post.comments} user={user} />
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewPostPage;
