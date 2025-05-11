import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Main.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      try {
        await login(form.username, form.password);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Login failed');
      }
    },
    [form, login, navigate]
  );

  return (
    <div className="create-post-page">
      <h2>Login</h2>
      <form className="create-post-form" onSubmit={handleLogin} autoComplete="on">
        {error && <p className="txt-error">{error}</p>}
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            required
            autoComplete="username"
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            required
            autoComplete="current-password"
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Sign In" className="form-submit-button" />
      </form>
      <div className="register-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/signup">Click here to Sign Up!</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
