import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Main.css';
import Sidebar from '../Components/Sidebar';
import PostList from '../Components/PostList';

const AdminPage = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('fart');

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
