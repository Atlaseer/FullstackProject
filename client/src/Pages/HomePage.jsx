import React from 'react';
import PostList from '../Components/PostList';
import '../styles/Main.css';

const HomePage = () => {
    return (
        <div className='homepage-container'>
            <main className="homepage-main">
                <PostList />
            </main>

        </div>
    )

}

export default HomePage;