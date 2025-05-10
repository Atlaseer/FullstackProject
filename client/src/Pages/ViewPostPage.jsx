import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import StarRating from '../Components/StarRating';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Main.css';
import PostContent from '../Components/PostContent';

const ViewPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();


  
  const [post, setPost] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/posts/${id}`, { withCredentials: true })
      .then((res) => {
        setPost(res.data);
        setRating(res.data.averageRating || 0);
        setLoading(false);
      })
      .catch(() => {
        setError('Post not found.');
        setLoading(false);
      });
  }, [id]);

  const handleRatingChange = async (newRating) => {
    try {
      setRating(newRating);
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
      console.error('Failed to rate post', err);
    }
  };

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
            <div className="post-card">
              <h2>{post.title}</h2>
              <p className="post-meta">
                <strong>Category:</strong> {post.categories?.join(', ') || 'None'}
              </p>
              <PostContent content={post.content}/>
              <p className="post-meta">
                <em>
                  By: {post.user?.username || 'Unknown'}{' '}
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
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewPostPage;
