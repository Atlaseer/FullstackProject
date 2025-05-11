import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Main.css'; // or create Login.css if preferred

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="create-post-page">
      <h2>Login</h2>
      <form className="create-post-form" onSubmit={handleLogin}>
        {error && <p className="txt-error">{error}</p>}

        <label>
          Username:
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <input type="submit" value="Sign In" className="form-submit-button" />
      </form>
      <div className="register-footer">
        <p>Don't have an account? <Link to="/signup">Click here to Sign Up!</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
