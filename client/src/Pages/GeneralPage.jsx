import React from 'react';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import '../styles/Main.css';

const GeneralPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          <div className="not-found-card">
            <h1>ℹ️ General Info</h1>
            <p>Welcome to the General page. Here will be some general info about our food forum coming soon!</p>
          </div>
        </div>
      </main>
    </div>
    )
}


export default GeneralPage