import React from "react";
import CreatePostForm from "../Components/CreatePostForm";
import '../styles/Main.css';

const CreatePostPage = () => {
    return (
        <div className='homepage-container'>
            <main className="homepage-main">
                <div className="post-list">
                    <CreatePostForm />
                </div>
            </main>

        </div>
    );
}

export default CreatePostPage;