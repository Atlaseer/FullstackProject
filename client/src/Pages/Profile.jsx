import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [err, setErr] = useState('');

    useEffect(() => {
        fetch(`/api/users/username/${username}`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText || 'Failed to load');
                return res.json();
            })
            .then(setUser)
            .catch(e => setErr(e.message));
    }, [username]);

    if (err) return <p className="error">{err}</p>;
    if (!user) return <p>Loading…</p>;

    return (
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
        </div>
    );
};

export default Profile;