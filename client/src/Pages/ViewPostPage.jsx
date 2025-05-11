import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Main.css';
import PostComments from '../Components/PostComments';
import PostDetails from '../Components/PostDetails';

const ViewPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`http://localhost:3000/api/posts/${id}`, { withCredentials: true })
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
        `http://localhost:3000/api/posts/${id}/rate`,
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

  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          {loading ? (
            <div className="not-found-card"><p>Loading post...</p></div>
          ) : error ? (
            <div className="not-found-card"><p>{error}</p></div>
          ) : (
            <>
              <PostDetails post={post} user={user} rating={rating} handleRatingChange={handleRatingChange} />
              <PostComments postId={post._id} comments={post.comments} user={user} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewPostPage;
