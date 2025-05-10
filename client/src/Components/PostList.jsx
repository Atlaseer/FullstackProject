import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import '../styles/Main.css';

import axios from 'axios';

const LIMIT = 10;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [error, setError] = useState('');
  
  const fetchData = async (page) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/posts?page=${page}&limit=${LIMIT}`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setPosts((prev) => [...prev, ...res.data]);
        if (page === 1) {
          // Optionally, total count could come from a separate endpoint or response metadata
          const total = res.data.length < LIMIT ? res.data.length : LIMIT * 2; // fallback
          setTotalPosts(total);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not load posts');
    }
  };
    
  
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchData(1);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = () =>
  {
    const nextPage = page + 1;
    fetchData(nextPage);
    setPage(nextPage);
  }

  return (
    <section className="post-list">
      <h2>Latest Posts</h2>

      {error && <p className="txt-error">{error}</p>}

      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={posts.length < totalPosts}
        loader={<p>Loading more...</p>}
        endMessage={<p>No more posts to load.</p>}
      >
        {posts.map((post) => (
          <div key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </InfiniteScroll>
    </section>
  );
};

export default PostList;
