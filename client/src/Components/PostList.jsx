import React, { useEffect, useState, useRef, useCallback } from 'react';
import PostCard from './PostCard';
import '../styles/Main.css';

import axios from 'axios';

const LIMIT = 10;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observer = useRef();
  
    // Fetch posts
    const fetchPosts = async () => {
      if (loading || !hasMore) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const res = await axios.get(`http://localhost:3000/api/posts?page=${page}&limit=${LIMIT}`, {
          withCredentials: true
        });
  
        if (res.data.length < LIMIT) setHasMore(false);
        setPosts((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      } catch (err) {
        setError('Could not load posts');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchPosts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Infinite Scroll observer
    const lastPostRef = useCallback((node) => {
      if (loading) return;
      if(observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) =>
      {
        if(entries[0].isIntersecting && hasMore)
        {
          fetchPosts();
        }
      });

      if(node) observer.current.observe(node);
    }, [loading, hasMore])
  return (
    <section className="post-list">
      <h2>Latest Posts</h2>
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <div ref={isLast ? lastPostRef : null} key={post._id}>
            <PostCard post={post} />
          </div>
        );
      })}

      {loading && <p>Loading more...</p>}
      {error && <p className="txt-error">{error}</p>}
      {!hasMore && <p>No more posts to load.</p>}
    </section>
  );
};

export default PostList;
