import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminStats from '../Components/AdminStats';
import AdminUsers from '../Components/AdminUsers';
import AdminPosts from '../Components/AdminPosts';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;


const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ topPost: null, totalUsers: 0, totalPosts: 0 });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/posts?limit=1000`, { withCredentials: true });
      const postsData = Array.isArray(res.data) ? res.data : res.data.posts || [];
      setPosts(postsData);
      const topPost = postsData.reduce((max, p) => (p.averageRating > (max?.averageRating || 0) ? p : max), null);
      setStats({
        topPost,
        totalUsers: users.length,
        totalPosts: postsData.length,
      });
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleDeletePost = async (postId) => {
  if (!window.confirm('Are you sure you want to delete this post?')) return;

  try {
    await axios.delete(`${VITE_SERVER_URL}/api/posts/${postId}`, {
      withCredentials: true,
    });
    fetchPosts(); // Refresh list
  } catch (err) {
    console.error('Failed to delete post:', err);
  }
};


  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  return (
    <div className="admin-container">
      <main className="admin-main">
        <h2>Admin Dashboard</h2>
        <AdminStats stats={stats} />
        <AdminUsers users={users} refreshUsers={fetchUsers} />
        <AdminPosts posts={posts} refreshPosts={fetchPosts} handleDeletePost={handleDeletePost} />
      </main>
    </div>
  );
};

export default AdminPage;
