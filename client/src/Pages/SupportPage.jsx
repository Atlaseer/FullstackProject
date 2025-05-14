import React from 'react';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import '../styles/Main.css';

const SupportPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          <div className="not-found-card">
            <h1>💬 Support</h1>
            <p>Welcome to the support page. Here you will recieve support about any issue you have!</p>

            <p>(We will be looking to add this feature in the near future.)</p>
          </div>
        </div>
      </main>
    </div>
    )
}


export default SupportPage