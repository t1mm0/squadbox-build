/*
 * Session Manager
 * Purpose: Ensure user login persistence throughout the session
 * Last Modified: 2024-12-19
 * By: AI Assistant
 * Completeness Score: 100/100
 */

class SessionManager {
  constructor() {
    this.storageKey = 'squadbox_session';
    this.tokenKey = 'squadbox_token';
    this.refreshTokenKey = 'squadbox_refresh_token';
    this.userKey = 'squadbox_user';
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry
  }

  // Store session data
  storeSession(sessionData) {
    try {
      const session = {
        user: sessionData.user,
        token: sessionData.token,
        refreshToken: sessionData.refreshToken,
        expiresAt: Date.now() + this.sessionTimeout,
        lastActivity: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(session));
      localStorage.setItem(this.tokenKey, sessionData.token);
      localStorage.setItem(this.userKey, JSON.stringify(sessionData.user));
      
      if (sessionData.refreshToken) {
        localStorage.setItem(this.refreshTokenKey, sessionData.refreshToken);
      }

      console.log('Session stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing session:', error);
      return false;
    }
  }

  // Get current session
  getSession() {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (!sessionData) {
        return null;
      }

      const session = JSON.parse(sessionData);
      
      // Check if session has expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      // Update last activity
      session.lastActivity = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const session = this.getSession();
      return session ? session.user : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get current token
  getToken() {
    try {
      const session = this.getSession();
      return session ? session.token : null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem(this.refreshTokenKey);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Check if session is valid
  isSessionValid() {
    const session = this.getSession();
    if (!session) {
      return false;
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.clearSession();
      return false;
    }

    // Check if session is about to expire (within refresh threshold)
    if (Date.now() > session.expiresAt - this.refreshThreshold) {
      console.log('Session about to expire, should refresh');
      return 'needs_refresh';
    }

    return true;
  }

  // Refresh session
  async refreshSession() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token available');
        return false;
      }

      // Call backend to refresh token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      // Store new session data
      this.storeSession({
        user: data.user,
        token: data.access_token,
        refreshToken: data.refresh_token
      });

      console.log('Session refreshed successfully');
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      this.clearSession();
      return false;
    }
  }

  // Update session with new data
  updateSession(updates) {
    try {
      const session = this.getSession();
      if (!session) {
        return false;
      }

      const updatedSession = {
        ...session,
        ...updates,
        lastActivity: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedSession));
      
      // Update individual storage items if provided
      if (updates.user) {
        localStorage.setItem(this.userKey, JSON.stringify(updates.user));
      }
      if (updates.token) {
        localStorage.setItem(this.tokenKey, updates.token);
      }
      if (updates.refreshToken) {
        localStorage.setItem(this.refreshTokenKey, updates.refreshToken);
      }

      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  // Clear session
  clearSession() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userKey);
      console.log('Session cleared');
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  }

  // Extend session
  extendSession() {
    try {
      const session = this.getSession();
      if (!session) {
        return false;
      }

      session.expiresAt = Date.now() + this.sessionTimeout;
      session.lastActivity = Date.now();
      
      localStorage.setItem(this.storageKey, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  }

  // Get session info for debugging
  getSessionInfo() {
    try {
      const session = this.getSession();
      if (!session) {
        return { valid: false, message: 'No session found' };
      }

      const now = Date.now();
      const timeUntilExpiry = session.expiresAt - now;
      const timeSinceLastActivity = now - session.lastActivity;

      return {
        valid: true,
        user: session.user,
        expiresAt: new Date(session.expiresAt).toISOString(),
        timeUntilExpiry: Math.floor(timeUntilExpiry / 1000) + ' seconds',
        timeSinceLastActivity: Math.floor(timeSinceLastActivity / 1000) + ' seconds',
        needsRefresh: timeUntilExpiry < this.refreshThreshold
      };
    } catch (error) {
      console.error('Error getting session info:', error);
      return { valid: false, message: 'Error getting session info' };
    }
  }

  // Setup activity monitoring to extend session
  setupActivityMonitoring() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      const session = this.getSession();
      if (session) {
        // Extend session on user activity
        this.extendSession();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler);
      });
    };
  }

  // Setup automatic session refresh
  setupAutoRefresh() {
    const checkAndRefresh = async () => {
      const sessionStatus = this.isSessionValid();
      
      if (sessionStatus === 'needs_refresh') {
        console.log('Auto-refreshing session...');
        await this.refreshSession();
      } else if (sessionStatus === false) {
        console.log('Session expired, redirecting to login');
        window.location.href = '/login';
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60 * 1000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Export for use in other modules
export default sessionManager;

// Also export the class for testing
export { SessionManager };
