import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import '../styles/Main.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ topPost: null, totalUsers: 0, totalPosts: 0, posts: [] });

//   useEffect(() => {
//     if (user && !user.isAdmin) {
//       navigate('/');
//     }
//   }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const fetchStats = async () => {
    try {
      const [postsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:3000/api/posts?limit=1000', { withCredentials: true }),
        axios.get('http://localhost:3000/api/users', { withCredentials: true })
      ]);
      const posts = Array.isArray(postsRes.data) ? postsRes.data : postsRes.data.posts || [];
      const topPost = posts.reduce((max, p) => (p.averageRating > (max?.averageRating || 0) ? p : max), null);
      setStats({
        topPost,
        totalUsers: usersRes.data.length,
        totalPosts: posts.length,
        posts
      });
    } catch (err) {
      // ignore stats error
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, { withCredentials: true });
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/posts/${postId}`, { withCredentials: true });
      fetchStats();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

//   if (!user || !user.isAdmin) return null;

  return (
    <div className='homepage-container'>
      <main className="homepage-main">
        <Sidebar />
        <h2>Admin Dashboard</h2>
        {error && <p className='txt-error'>{error}</p>}
        <div style={{ marginBottom: 24 }}>
          <h3>Statistics</h3>
          <ul>
            <li><strong>Total Users:</strong> {stats.totalUsers}</li>
            <li><strong>Total Posts:</strong> {stats.totalPosts}</li>
            {stats.topPost && (
              <li>
                <strong>Top Post:</strong> "{stats.topPost.title}" by {stats.topPost.user?.username || 'Unknown'} (Avg. Rating: {stats.topPost.averageRating?.toFixed(2) || 0})
                <button style={{marginLeft:8}} onClick={() => handleDeletePost(stats.topPost._id)}>Delete</button>
              </li>
            )}
          </ul>
        </div>
        <h3>All Posts</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.posts.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.user?.username || 'Unknown'}</td>
                <td>{p.averageRating?.toFixed(2) || 0}</td>
                <td>{p.views || 0}</td>
                <td><button onClick={() => handleDeletePost(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? '✅' : '❌'}</td>
                <td>{u.isActive ? '✅' : '❌'}</td>
                <td><button onClick={() => handleDeleteUser(u._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminPage;
