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
            <p>FoodLover is a website forum for people that love food, here you can not only post your own favorite 
            recipes but also interact and get inspiration for new recipes from other food lovers!
            </p>
          </div>
        </div>
      </main>
    </div>
    )
}


export default AboutPage