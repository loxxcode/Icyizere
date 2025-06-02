import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token is expired
          localStorage.removeItem('token');
          setCurrentUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Set auth token header
        setAuthToken(token);
        
        // Get user data
        const res = await axios.get('/api/auth/me');
        setCurrentUser(res.data.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
      console.error('Authentication error:', err);
    }
    
    setLoading(false);
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth/register', userData);
      
      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      
      // Set auth token header
      setAuthToken(res.data.token);
      
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth/login', userData);
      
      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      
      // Set auth token header
      setAuthToken(res.data.token);
      
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Remove auth header
    setAuthToken(false);
    
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Set auth token for axios requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
