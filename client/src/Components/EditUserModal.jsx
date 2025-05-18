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
      <div className="modal-content">
        <h3>Edit User: {user.username}</h3>
        <form className="modal-form" onSubmit={handleSave}>
         <h3>Edit User: {userToEdit?.username}</h3>

         <label>
           Admin
           <input
             type="checkbox"
             checked={form.isAdmin}
             onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
           />
         </label>

         <label>
           Active
           <input
             type="checkbox"
             checked={form.isActive}
             onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
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
