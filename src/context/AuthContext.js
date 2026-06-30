import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedUser = localStorage.getItem('currentUser');
      const accessToken = localStorage.getItem('accessToken');
      if (savedUser && accessToken) {
        try {
          // Verify access token by fetching current user info
          const response = await api.get('users/me/');
          setCurrentUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error during initial auth verification:', error);
          // If we fail to load profile, clear localStorage
          localStorage.removeItem('currentUser');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const register = async (username, email, password, role) => {
    try {
      const response = await api.post('users/register/', {
        username,
        email,
        password,
        role,
      });
      
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.error || 'Registration failed. Please check your inputs.';
      return { success: false, message: msg };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('users/login/', {
        username: email, // Backend login expects identifier under 'username'
        password: password,
      });
      
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.error || 'Invalid credentials';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.post('users/change_password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return { success: true, message: response.data.message || 'Password changed successfully' };
    } catch (error) {
      console.error('Password change error:', error);
      const msg = error.response?.data?.error || 'Failed to change password';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      loading,
      login,
      logout,
      changePassword,
      register,
    }}>
      {!loading ? children : (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
        }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted fw-bold">Authenticating session...</h5>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
