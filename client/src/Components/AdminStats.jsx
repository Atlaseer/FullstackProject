import React from 'react';

const AdminStats = ({ stats }) => {
  return (
    <section className="admin-section">
      <h3>Statistics</h3>
      <ul>
        <li><strong>Total Users:</strong> {stats.totalUsers}</li>
        <li><strong>Total Posts:</strong> {stats.totalPosts}</li>
        {stats.topPost && (
          <li>
            <strong>Top Post:</strong> "{stats.topPost.title}" by {stats.topPost.user?.username || 'Unknown'} (Avg. Rating: {stats.topPost.averageRating?.toFixed(2) || 0})
          </li>
        )}
      </ul>
    </section>
  );
};

export default AdminStats;
