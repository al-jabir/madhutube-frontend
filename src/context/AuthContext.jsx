import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // Check if we have tokens
        if (accessToken && refreshToken) {
          try {
            // Try to get current user with existing access token
            const response = await authAPI.getCurrentUser();
            setUser(response.data.data);
          } catch (error) {
            // If getting user fails, token might be expired
            // Try to refresh the token
            if (error.response?.status === 401) {
              try {
                const refreshResponse = await authAPI.refreshToken();
                const { accessToken: newAccessToken } = refreshResponse.data.data;

                // Store new access token
                localStorage.setItem('accessToken', newAccessToken);

                // Try to get current user again with refreshed token
                const userResponse = await authAPI.getCurrentUser();
                setUser(userResponse.data.data);
              } catch (refreshError) {
                // Refresh failed, clear tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
              }
            } else {
              // Some other error, but keep tokens as they might still be valid
              // This could be a network error or other temporary issue
              // We'll try to use existing tokens
              console.warn('Error getting current user, but keeping existing tokens:', error);
              // Try one more time to verify
              try {
                const retryResponse = await authAPI.getCurrentUser();
                setUser(retryResponse.data.data);
              } catch (retryError) {
                console.error('Retry failed, clearing tokens:', retryError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
              }
            }
          }
        }
      } catch (error) {
        // General error, clear tokens
        console.error('General auth error, clearing tokens:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(credentials);

      const { user: userData, accessToken, refreshToken } = response.data.data;

      // Store tokens with expiration checks
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set user state
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);

      // Clear any existing tokens on failed login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);

      const { user: newUser, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set user state
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);

      // Clear any existing tokens on failed registration
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear everything regardless of API call result
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setError(null);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};