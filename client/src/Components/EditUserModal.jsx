import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ isAdmin: false, isActive: true });

  useEffect(() => {
    if (user) {
      setForm({ isAdmin: user.isAdmin, isActive: user.isActive });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${user._id}`, form, { withCredentials: true });
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <h3>Edit User: {user.username}</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            <span>Admin</span>
            <input
              type="checkbox"
              name="isAdmin"
              checked={form.isAdmin}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Active</span>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              <FaCheck /> Save
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
