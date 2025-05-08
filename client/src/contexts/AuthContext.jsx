import React, {createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null); // Null = not logged in

    const login = (username) => setUser({username});
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}