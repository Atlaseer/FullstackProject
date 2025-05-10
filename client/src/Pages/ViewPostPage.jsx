import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../Components/StarRating';
import { useAuth } from '../contexts/AuthContext';


const ViewPostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3000/api/posts/${id}`, { withCredentials: true })
        .then((res) => {
            setPost(res.data);
            setRating(res.data.rating || 0); // assuming your post model includes `rating`
      setLoading(false);
        })
        .catch((err) => {
            setError('Post not found.');
            setLoading(false);
        });
    }, [id]);

    const handleRatingChange = async (newRating) => {
        try {
          setRating(newRating);
          await axios.post(`http://localhost:3000/api/posts/${id}/rate`, {
            rating: newRating
          }, { withCredentials: true });
        } catch (err) {
          console.error('Failed to set rating', err);
        }
    };

    
    if (loading) return <div style={{ padding: '20px' }}>Loading post...</div>;
    if (error) return <div style={{ padding: '20px' }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>{post.title}</h2>
            <p><strong>Category:</strong> {post.categories?.join(', ') || 'None'}</p>
            <p>{post.content}</p>
            <p>
                <em>
                By: {post.user?.username || 'Unknown'}{' '}
                <StarRating
                  rating={rating}
                  onRate={user ? handleRatingChange : null}
                />
                </em>
            </p>
      </div>
    )
}

export default ViewPostPage;