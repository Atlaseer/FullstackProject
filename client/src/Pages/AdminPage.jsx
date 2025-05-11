import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import '../styles/Main.css';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className='homepage-container'>
      <main className="homepage-main">
        <Sidebar />
        <h2>Admin Dashboard</h2>
        {error && <p className='txt-error'>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? '✅' : '❌'}</td>
                <td>{u.isActive ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminPage;
