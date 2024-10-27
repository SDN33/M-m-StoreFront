"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        setIsAuthenticated(!!token);
    }, []);

    const login = (token) => {
        localStorage.setItem("jwtToken", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
