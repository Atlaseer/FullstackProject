import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Profile.css';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [err, setErr] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
        fetch(`${VITE_SERVER_URL}/api/users/username/${username}`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText || 'Failed to load');
                return res.json();
            })
            .then(setUser)
            .catch(e => setErr(e.message));
    }, [username]);

    useEffect(() => {
        if (!user) return;
        fetch(`${VITE_SERVER_URL}/api/posts/user/${user._id}`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText || 'Failed to load posts');
                return res.json();
            })
            .then(setPosts)
            .catch(e => setErr(e.message));
    }, [user]);

    if (err) return <p className="error">{err}</p>;
    if (!user) return <p>Loading…</p>;

    return (
        <div className='profile-holder'>

            <div className="profile-container">
                <header className="profile-header">
                    <h1>{user.firstName} {user.lastName}</h1>
                </header>
                <div className="profile-body">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                    <p className="joined">
                        Joined on {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <section className="profile-posts">
                    <h2>Posts by {user.username}</h2>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="post-item">
                                <h3>{post.title}</h3>
                                <Link to={`/post/${post._id}`}>Read more</Link>
                            </div>
                        ))
                    ) : (<p>This user has not posted anything yet</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Profile;
