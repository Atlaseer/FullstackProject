import React, { useEffect, useState, useRef } from 'react';
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
  const hasFetchedInitial = useRef(false); // prevent duplicate fetch
  
  const fetchData = async (pageNum) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/posts?page=${pageNum}&limit=${LIMIT}`,
        { withCredentials: true }
      );

      if (res.status === 200) 
      {
        setPosts((prev) => [...prev, ...res.data]);
        if (pageNum === 1)
        {
          const total = res.data.length < LIMIT ? res.data.length : LIMIT * 2;
          setTotalPosts(total);
        }
      }
    } 
    catch (err) 
    {
      console.error(err);
      setError('Could not load posts');
    }
  };

  useEffect(() => {
    if (!hasFetchedInitial.current) 
    {
      hasFetchedInitial.current = true;
      fetchData(1);
    }
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

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
