import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/auth/me', {
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.username) {
        setUser(res.data);
      }
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await axios.post(
      'http://localhost:3000/api/auth/login',
      { username, password },
      { withCredentials: true }
    );
    setUser(res.data.user); // ← This must trigger re-render
  };

  const logout = async () => {
    await axios.post('http://localhost:3000/api/auth/logout', {}, {
      withCredentials: true,
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
