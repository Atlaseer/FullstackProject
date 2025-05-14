import React from 'react';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import '../styles/Main.css';

const OffTopicPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          <div className="not-found-card">
            <h1>🌐 Off topic</h1>
            <p>Welcome to the Off Topic page. Here you can find everything that is unrelated and off topic!</p>
            
            <p>(We will be looking to add this feature in the near future.)</p>
          </div>
        </div>
      </main>
    </div>
    )
}


export default OffTopicPage