import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const BannedPage = () => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/'; // Redirect to homepage after logout
  };

  return (
    <div className="banned-page">
      <h1>Account Banned</h1>
      <p>Your account has been banned. Please contact support for further assistance.</p>
      <button onClick={handleSignOut} className="signout-button">Sign Out</button>
    </div>
  );
};

export default BannedPage;
