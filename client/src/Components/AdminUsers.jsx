import React, { useState } from 'react';
import axios from 'axios';
import EditUserModal from './EditUserModal';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;


const AdminUsers = ({ users, refreshUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${VITE_SERVER_URL}/api/users/${userId}`, { withCredentials: true });
      refreshUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <section className="admin-section">
      <h3>All Users</h3>
      <table className="admin-table">
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
              <td>{u.email || '-'}</td>
              <td>{u.isAdmin ? '✅' : '❌'}</td>
              <td>{u.isActive ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => setSelectedUser(u)}>Edit</button>
                <button onClick={() => handleDeleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={() => {
            setSelectedUser(null);
            refreshUsers();
          }}
        />
      )}
    </section>
  );
};

export default AdminUsers;
