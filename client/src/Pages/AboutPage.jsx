import React from 'react';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import '../styles/Main.css';

const AboutPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <Sidebar />
        <div className="post-list">
          <div className="not-found-card">
            <h1>About FoodLover</h1>
            <p>Welcome to FoodLover!</p>
            <p>We who work here are:</p>
            <p>Richard - Lead frontend - </p>
            <p>Simon Edman Persson - Lead backend - Created mongoDB database</p>
          </div>
        </div>
      </main>
    </div>
    )
}


export default AboutPage