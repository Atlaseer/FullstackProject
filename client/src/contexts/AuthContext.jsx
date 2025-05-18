import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${VITE_SERVER_URL}/api/auth/me`, {
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
      `${VITE_SERVER_URL}/api/auth/login`,
      { username, password },
      { withCredentials: true }
    );
    setUser(res.data.user); // ← This must trigger re-render
  };

  const logout = async () => {
    await axios.post(`${VITE_SERVER_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    });
    setUser(null);
  };

  const isAdmin = user?.admin || false;
  const isActive = user?.active || false;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isActive }}>
      {children}
    </AuthContext.Provider>
  );
};
