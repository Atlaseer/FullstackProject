import React from 'react';
import PostCard from './PostCard';
import '../styles/Main.css';

const samplePosts = [
  { id: 1, title: "Welcome to the Forum!", author: "Admin", replies: 10 },
  { id: 2, title: "How do I reset my password?", author: "User123", replies: 4 },
  { id: 3, title: "New features coming soon", author: "Moderator", replies: 8 },
];

const PostList = () => {
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
