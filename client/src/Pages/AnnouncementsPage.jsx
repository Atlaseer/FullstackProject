import React from 'react';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import '../styles/Main.css';

const AnnouncementsPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          <div className="not-found-card">
            <h1>📢 Announcements</h1>
            <p>Welcome to the announcements page. Stay tuned for updates and important info!</p>
          </div>
        </div>
      </main>
    </div>
    )
}


export default AnnouncementsPage