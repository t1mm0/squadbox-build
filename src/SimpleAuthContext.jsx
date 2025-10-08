import React, { createContext, useState, useContext } from 'react';

// Simple Auth Context that won't cause errors
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    setLoading,
    profile,
    setProfile,
    isAuthenticated: !!currentUser,
    login: async (email, password) => {
      console.log('Login attempt:', email);
      // Mock login for now
      setCurrentUser({ email, id: 'mock-user' });
      return { success: true };
    },
    logout: async () => {
      console.log('Logout');
      setCurrentUser(null);
      setProfile(null);
    },
    signup: async (email, password) => {
      console.log('Signup attempt:', email);
      // Mock signup for now
      setCurrentUser({ email, id: 'mock-user' });
      return { success: true };
    },
    register: async (email, password, username) => {
      console.log('Register attempt:', email, username);
      // Mock register for now
      setCurrentUser({ email, id: 'mock-user', username });
      return { success: true };
    },
    updateSubscription: async (plan) => {
      console.log('Update subscription:', plan);
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
