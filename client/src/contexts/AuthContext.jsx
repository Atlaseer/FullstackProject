import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading while checking session

  // Check session on app load
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/me', {
      credentials: 'include' // Required for cookies
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.username) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // enable cookies
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);a
    }

    const userData = await res.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
