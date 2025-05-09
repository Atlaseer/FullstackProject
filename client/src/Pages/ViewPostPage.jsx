import React from "react";
import { useParams } from "react-router-dom";


const ViewPostPage = () => {
    const { id } = useParams();

    // const post = posts.find((post) => post.id === parseInt(id, 10));

    // if(!post) {
    //     return <div>Post not found</div>;
    // }

    return (
        <div style={{ padding: "20px" }}>
            <h2>title</h2>
            <p><strong>Category:</strong> category</p>
            <p>Hey</p>
            <p><em>By: Richard</em></p>
      </div>
    )
}

export default ViewPostPage;