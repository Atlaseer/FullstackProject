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
            <p>Simon Edman Persson - Lead backend - Created file structure and github repo, created mongoDB database and managed database access, created User, Comment and Post model, created user, comment and post route, as well as index.js, created tests to check backend coverage, created scripts to run the client and server simultaneously, as well as a script for tests, uploaded the project to Render, and wrote the report.</p>
          </div>
        </div>
      </main>
    </div>
    )
}

export default AboutPage
