import React from 'react';
import Sidebar from '../Components/Sidebar';
import PostList from '../Components/PostList';
import Footer from '../Components/Footer';
import '../styles/Main.css';

const HomePage = () => {
    return (
        <div className='homepage-container'>
            <main className="homepage-main">
                <Sidebar />
                <PostList />
            </main>

            <Footer />
        </div>
    )

}

export default HomePage;