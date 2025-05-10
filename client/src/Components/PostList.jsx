import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import '../styles/Main.css';

import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  
  return (
    <section className="post-list">
      <h2>Latest Posts</h2>
      {samplePosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PostList;
