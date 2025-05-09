import React from 'react';
import '../styles/Loading.css';

const LoadingPage = () => {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p>Loading, please wait...</p>
    </div>
  );
};

export default LoadingPage;
