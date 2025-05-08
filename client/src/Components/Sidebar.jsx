import React from 'react';
import '../styles/Main.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li><a href="/general">General</a></li>
        <li><a href="/announcements">Announcements</a></li>
        <li><a href="/support">Support</a></li>
        <li><a href="/off-topic">Off Topic</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
