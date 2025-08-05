import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser, createUser, updateUser, findUserById } from '../utils/database';

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

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('parkingBuddyUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify user still exists in database
        const currentUser = findUserById(userData.id);
        if (currentUser) {
          setUser(userData);
        } else {
          // User no longer exists in database, clear session
          localStorage.removeItem('parkingBuddyUser');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('parkingBuddyUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use real database authentication
      const result = authenticateUser(email, password);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      const userData = result.user;
      
      setUser(userData);
      localStorage.setItem('parkingBuddyUser', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use real database to create user
      const result = createUser(userData);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      const newUser = result.user;
      
      setUser(newUser);
      localStorage.setItem('parkingBuddyUser', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parkingBuddyUser');
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const result = updateUser(user.id, updates);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      const updatedUser = result.user;
      setUser(updatedUser);
      localStorage.setItem('parkingBuddyUser', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 