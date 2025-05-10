import React from 'react';
import Sidebar from '../Components/Sidebar';
import '../styles/Main.css';

const FourOFourPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          <div className="not-found-card">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" className="back-home-link">← Back to Home</a>
          </div>
        </div>
      </main>
    </div>
    )
}


export default FourOFourPage