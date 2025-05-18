import React, { useEffect, useState, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import '../styles/Main.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const LIMIT = 10;

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [error, setError] = useState('');
  const hasFetchedInitial = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();
  const urlSearchTerm = query.get('search') || '';
  const sort = query.get('sort') || 'alltime';
  const sortBy = query.get('sortBy') || 'date';
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;


  const fetchData = useCallback(async (pageNum, searchValue, sortValue, sortByValue) => {
    try {
      let url = `${VITE_SERVER_URL}/api/posts?page=${pageNum}&limit=${LIMIT}`;
      if (searchValue) {
        url += `&search=${encodeURIComponent(searchValue)}`;
      }
      if (sortValue && sortValue !== 'alltime') {
        url += `&sort=${sortValue}`;
      }
      if (sortByValue && sortByValue !== 'date') {
        url += `&sortBy=${sortByValue}`;
      }
      const res = await axios.get(url, { withCredentials: true });
      if (res.status === 200) {
        const data = Array.isArray(res.data) ? res.data : res.data.posts || [];
        setPosts((prev) => pageNum === 1 ? data : [...prev, ...data]);
        if (pageNum === 1) {
          setTotalPosts(res.data.total || data.length);
        }
      }
    } catch (err) {
      setError('Could not load posts');
    }
  }, []);

  // Fetch on mount and when sort/search in URL changes (for back/forward nav)
  useEffect(() => {
    setPosts([]);
    setPage(1);
    hasFetchedInitial.current = true;
    fetchData(1, urlSearchTerm, sort, sortBy);
    // eslint-disable-next-line
  }, [urlSearchTerm, sort, sortBy, location.key]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, urlSearchTerm, sort, sortBy);
  }, [page, fetchData, urlSearchTerm, sort, sortBy]);

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
