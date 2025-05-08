import React from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../contexts/PostContext";

const ViewPostPage = () => {
    const { id } = useParams();
    const { posts } = usePosts();
    const post = posts.find((post) => post.id === parseInt(id, 10));

    if(!post) {
        return <div>Post not found</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>{post.title}</h2>
            <p><strong>Category:</strong> {post.category}</p>
            <p>{post.body}</p>
            <p><em>By: {post.author}</em></p>
      </div>
    )
}

export default ViewPostPage;