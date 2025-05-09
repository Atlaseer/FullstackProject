import React from "react";
import CreatePostForm from "../Components/CreatePostForm";
import '../styles/Main.css';
import Sidebar from "../Components/Sidebar";

const CreatePostPage = () => {
    return (
        <div className='homepage-container'>
            <main className="homepage-main">
                <Sidebar />
                <CreatePostForm/>
            </main>

        </div>
    );
}

export default CreatePostPage;