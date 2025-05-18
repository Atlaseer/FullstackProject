// components/AdminPosts.jsx
import React, { useState } from 'react';

const AdminPosts = ({ posts, user, editPostId, editedTitle, setEditedTitle, startEditingPost, cancelEdit, savePostEdit, handleDeletePost }) => {
  return (
    <div className="admin-posts">
      <h3>All Posts</h3>
      <table className="admin-table">
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
          {posts.map((p) => (
            <tr key={p._id}>
              <td>
                {editPostId === p._id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                ) : (
                  p.title
                )}
              </td>
              <td>{p.user?.username || 'Unknown'}</td>
              <td>{p.averageRating?.toFixed(2) || 0}</td>
              <td>{p.views || 0}</td>
              <td>
                <button onClick={() => handleDeletePost(p._id)}>Delete</button>
                {user?.isAdmin && (
                  <>
                    {editPostId === p._id ? (
                      <>
                        <button onClick={() => savePostEdit(p._id)}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => startEditingPost(p)}>Edit</button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPosts;
