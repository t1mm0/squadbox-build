/*
 * AuthContext.jsx
 * Purpose: Authentication context for Squadbox app using database abstraction layer
 * Last modified: 2025-08-08
 * Completeness score: 100
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { notifications } from '@mantine/notifications';
import { auth, db, DatabaseFactory, DB_PROVIDERS } from './lib/database';

// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false to prevent blank page
  const [profile, setProfile] = useState(null);
  const [currentProvider, setCurrentProvider] = useState(DatabaseFactory.getCurrentProvider());

  // Check if user is authenticated on load
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        
        // Check if auth is available
        if (!auth) {
          console.log('Auth not available, skipping authentication');
          setLoading(false);
          return;
        }
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 300)
        );
        
        const sessionPromise = auth.getSession();
        const { session } = await Promise.race([sessionPromise, timeoutPromise]);
        
        console.log('Session result:', session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          // Load profile in background, don't block UI
          loadUserProfile(session.user.id).catch(console.error);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        console.log('Authentication failed, proceeding without auth');
        // Set a default user for development
        setCurrentUser(null);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    // Add timeout to prevent infinite loading - much shorter for public pages
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout, forcing loading to false');
      setLoading(false);
    }, 100); // 100ms timeout - very fast response for public pages

    // Listen for auth changes
    let subscription;
    try {
      const { data } = auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          // Load profile in background, don't block UI
          loadUserProfile(session.user.id).catch(console.error);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await db.getUserProfile(userId);
      if (error) {
        console.error('Error loading user profile:', error);
      }
      if (!data) {
        // No profile yet; create a default one
        const defaultProfile = {
          id: userId,
          email: currentUser?.email || '',
          username: currentUser?.email?.split('@')[0] || 'user',
          name: currentUser?.user_metadata?.name || 'New User',
          role: 'user',
          subscription: 'free',
          project_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const { error: profileError } = await db.createUserProfile(defaultProfile);
        if (profileError) {
          console.error('Error creating default profile:', profileError);
          return;
        }
        setProfile(defaultProfile);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Switch database provider
  const switchProvider = (provider) => {
    if (Object.values(DB_PROVIDERS).includes(provider)) {
      setCurrentProvider(provider);
      DatabaseFactory.setProvider(provider);
      
      // Reload the page to reinitialize with new provider
      window.location.reload();
      
      notifications.show({
        title: 'Provider Changed',
        message: `Switched to ${provider} provider`,
        color: 'blue'
      });
    } else {
      notifications.show({
        title: 'Invalid Provider',
        message: `Unknown provider: ${provider}`,
        color: 'red'
      });
    }
  };

  // Register new user
  const register = async (username, email, password, name) => {
    try {
      setLoading(true);
      
      const { data, error } = await auth.signUp(email, password, {
        data: {
          username,
          name
        }
      });
      
      if (error) {
        notifications.show({
          title: 'Registration failed',
          message: error.message,
          color: 'red'
        });
        return { success: false, error: error.message };
      }

      // Create user profile in database
      if (data.user) {
       const profileData = {
          id: data.user.id,
          email: data.user.email,
          username: username,
          name: name,
          role: 'user', // roles: 'user' | 'admin' | 'investor'
          subscription: 'free',
          project_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await db.createUserProfile(profileData);
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please check your email to confirm your account.',
        color: 'green'
      });
      return { success: true };
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Server error, please try again later.',
        color: 'red'
      });
      return { success: false, error: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        notifications.show({
          title: 'Login failed',
          message: error.message,
          color: 'red'
        });
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
      }

      notifications.show({
        title: 'Success',
        message: 'Login successful! Redirecting to your projects...',
        color: 'green'
      });
      
      // Redirect to ai-dev-squad after successful login
      setTimeout(() => {
        // Use both methods to ensure redirect works
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        // Also dispatch a custom event for the App component to handle
        window.dispatchEvent(new CustomEvent('sbox:navigate', { 
          detail: { view: 'ai-dev-squad' } 
        }));
      }, 1000);
      
      return { success: true };
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Server error, please try again later.',
        color: 'red'
      });
      return { success: false, error: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }

      setCurrentUser(null);
      setProfile(null);
      
      notifications.show({
        title: 'Logged out',
        message: 'You have been logged out.',
        color: 'blue'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user subscription
  const updateSubscription = async (subscriptionType) => {
    try {
      if (!currentUser) {
        notifications.show({
          title: 'Authentication required',
          message: 'Please log in to update subscription.',
          color: 'orange'
        });
        return { success: false };
      }

      const { data, error } = await db.updateUserProfile(currentUser.id, {
        subscription: subscriptionType
      });
      
      if (error) {
        notifications.show({
          title: 'Update failed',
          message: error.message,
          color: 'red'
        });
        return { success: false, error: error.message };
      }

      // Update local profile state
      setProfile(prev => ({ ...prev, subscription: subscriptionType }));
      
      notifications.show({
        title: 'Success',
        message: `Subscription updated to ${subscriptionType}`,
        color: 'green'
      });
      return { success: true };
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Server error, please try again later.',
        color: 'red'
      });
      return { success: false, error: 'Server error' };
    }
  };

  const value = {
    currentUser,
    profile,
    isAuthenticated: !!currentUser,
    loading,
    currentProvider,
    register,
    login,
    logout,
    updateSubscription,
    switchProvider
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;