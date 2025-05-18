import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const RegisterPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect if already signed in
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${VITE_SERVER_URL}/api/users`, form, {
        withCredentials: true
      });

      await login(form.username, form.password); // auto-login
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div className="create-post-page">
      <h2>Sign Up</h2>
      {error && <p className="txt-error">{error}</p>}

      <form className="create-post-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <input type="submit" value="Register" className="form-submit-button" />
      </form>

      <div className="register-footer">
        <p>Already registered? <Link to="/login">Click here to log in</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
