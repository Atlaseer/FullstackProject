import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import '../styles/Main.css';

import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() =>{
    axios.get('http://localhost:3000/api/posts', {withCredentials:true})
    .then((res) => {
      setPosts(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Failed to load posts: ', err);
      setError("Could not load posts.");
      setLoading(false);
    })
  }, []);


  return (
    <section className="post-list">
      <h2>Latest Posts</h2>
      {loading && <p>Loading posts...</p>}
      {error && <p className="txt-error">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>No posts available.</p>}
      {posts.map((post) => (
        <PostCard key={post._id || post.id} post={post} />
      ))}
    </section>
  );
};

export default PostList;
