import React from "react";
import CreatePostForm from "../Components/CreatePostForm";
import '../styles/Main.css';

const CreatePostPage = () => {
    return (
        <div className="create-post-page">
            <h1>Create a New Post</h1>
            <CreatePostForm />
        </div>
    );
}

export default CreatePostPage;