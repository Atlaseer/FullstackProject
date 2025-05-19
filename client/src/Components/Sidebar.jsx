import React from 'react';
import '../styles/Main.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li><Link to="/general">General</Link></li>
        <li><Link to="/announcements">Announcements</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
