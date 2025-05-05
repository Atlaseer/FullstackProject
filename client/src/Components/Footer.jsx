import React from 'react';
import '../styles/Main.css';

const Footer = () => {
  return (
    <footer className="forum-footer">
      <p>&copy; {new Date().getFullYear()} ForumHub. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
