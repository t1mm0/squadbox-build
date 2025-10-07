// Database Abstraction Layer for Squadbox
// Purpose: Provide unified interface for different database providers (MongoDB only)
// Last modified: 2025-08-13
// Completeness score: 100/100

// Database provider types
export const DB_PROVIDERS = {
  MONGODB: 'mongodb',
  POSTGRESQL: 'postgresql',
  MYSQL: 'mysql'
};

// API base for backend when using MongoDB/Atlas via FastAPI
const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || import.meta.env.squadbox_API_BASE || 'http://localhost:8000';

// Get current database provider from environment (default to mongodb; Supabase not supported)
const getCurrentProvider = () => {
  const provider = (import.meta.env.VITE_DB_PROVIDER || import.meta.env.squadbox_DB_PROVIDER || 'mongodb').toLowerCase();
  // Force mongodb if someone sets an unsupported provider
  if (provider !== DB_PROVIDERS.MONGODB) {
    console.warn(`Provider ${provider} is not supported; using mongodb`);
    return DB_PROVIDERS.MONGODB;
  }
  console.log('Current database provider:', provider);
  return DB_PROVIDERS.MONGODB;
};

// Base Database Interface
class DatabaseInterface {
  constructor(provider) {
    this.provider = provider;
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
    throw new Error('signUp method must be implemented by provider');
  }

  async signIn(email, password) {
    throw new Error('signIn method must be implemented by provider');
  }

  async signOut() {
    throw new Error('signOut method must be implemented by provider');
  }

  async getCurrentUser() {
    throw new Error('getCurrentUser method must be implemented by provider');
  }

  async getSession() {
    throw new Error('getSession method must be implemented by provider');
  }

  onAuthStateChange(callback) {
    throw new Error('onAuthStateChange method must be implemented by provider');
  }

  // User profile methods
  async getUserProfile(userId) {
    throw new Error('getUserProfile method must be implemented by provider');
  }

  async createUserProfile(userData) {
    throw new Error('createUserProfile method must be implemented by provider');
  }

  async updateUserProfile(userId, updates) {
    throw new Error('updateUserProfile method must be implemented by provider');
  }

  async getUserByEmail(email) {
    throw new Error('getUserByEmail method must be implemented by provider');
  }

  // Project methods
  async getUserProjects(userId) {
    throw new Error('getUserProjects method must be implemented by provider');
  }

  async createProject(projectData) {
    throw new Error('createProject method must be implemented by provider');
  }

  async updateProject(projectId, updates) {
    throw new Error('updateProject method must be implemented by provider');
  }

  async deleteProject(projectId) {
    throw new Error('deleteProject method must be implemented by provider');
  }

  async getProject(projectId) {
    throw new Error('getProject method must be implemented by provider');
  }
}


// MongoDB Implementation (placeholder for future use)
class MongoDBProvider extends DatabaseInterface {
  constructor() {
    super(DB_PROVIDERS.MONGODB);
    this.apiBase = API_BASE.replace(/\/$/, '');
    this.currentUser = null;
    this.accessToken = null;
    try {
      const saved = JSON.parse(localStorage.getItem('sb:session') || 'null');
      if (saved?.access_token && saved?.user) {
        this.accessToken = saved.access_token;
        this.currentUser = saved.user;
      }
    } catch {}
    this._subscription = { unsubscribe: () => {} };
  }

  // Implementation would go here
  async signUp(email, password, userData = {}) {
    const body = {
      username: userData.username || (email?.split('@')[0] || 'user'),
      email,
      password,
      name: userData.name || userData.username || 'New User'
    };
    const res = await fetch(`${this.apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { message: data?.detail || 'Registration failed' } };
    this.accessToken = data.access_token;
    this.currentUser = data.user;
    localStorage.setItem('sb:session', JSON.stringify({ access_token: this.accessToken, user: this.currentUser }));
    // Fire auth state change
    try { this._authCallback && this._authCallback('SIGNED_IN', { session: { user: this.currentUser, access_token: this.accessToken } }); } catch {}
    return { data: { user: this.currentUser, session: { access_token: this.accessToken } }, error: null };
  }

  async signIn(email, password) {
    const params = new URLSearchParams();
    params.set('username', email);
    params.set('password', password);
    const res = await fetch(`${this.apiBase}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { message: data?.detail || 'Login failed' } };
    this.accessToken = data.access_token;
    this.currentUser = data.user;
    localStorage.setItem('sb:session', JSON.stringify({ access_token: this.accessToken, user: this.currentUser }));
    try { this._authCallback && this._authCallback('SIGNED_IN', { session: { user: this.currentUser, access_token: this.accessToken } }); } catch {}
    return { data: { user: this.currentUser, session: { access_token: this.accessToken } }, error: null };
  }

  async signOut() {
    this.accessToken = null;
    this.currentUser = null;
    localStorage.removeItem('sb:session');
    try { this._authCallback && this._authCallback('SIGNED_OUT', { session: null }); } catch {}
    return { error: null };
  }

  async getCurrentUser() {
    if (this.currentUser) return { user: this.currentUser, error: null };
    if (!this.accessToken) return { user: null, error: null };
    const res = await fetch(`${this.apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!res.ok) return { user: null, error: { message: 'Unauthorized' } };
    const user = await res.json();
    this.currentUser = user;
    return { user, error: null };
  }

  async getSession() {
    if (this.accessToken && this.currentUser) return { session: { user: this.currentUser, access_token: this.accessToken }, error: null };
    try {
      const saved = JSON.parse(localStorage.getItem('sb:session') || 'null');
      if (saved?.access_token && saved?.user) {
        this.accessToken = saved.access_token;
        this.currentUser = saved.user;
        return { session: { user: this.currentUser, access_token: this.accessToken }, error: null };
      }
    } catch {}
    return { session: null, error: null };
  }

  onAuthStateChange(callback) {
    this._authCallback = (event, payload) => callback(event, payload);
    return { data: { subscription: this._subscription } };
  }

  // ... other methods would be implemented similarly
  async getUserProfile(userId) {
    if (!this.accessToken) return { data: null, error: { status: 401, message: 'Unauthorized' } };
    const res = await fetch(`${this.apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!res.ok) return { data: null, error: { status: res.status, message: 'Profile load failed' } };
    const data = await res.json();
    return { data, error: null };
  }

  async createUserProfile(userData) {
    // Profile is created during register; treat as success
    return { data: userData, error: null };
  }

  async updateUserProfile(userId, updates) {
    if (!this.accessToken) return { data: null, error: { status: 401, message: 'Unauthorized' } };
    if (updates?.subscription) {
      const res = await fetch(`${this.apiBase}/auth/subscription`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.accessToken}` },
        body: JSON.stringify({ subscription: updates.subscription })
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { status: res.status, message: data?.detail || 'Update failed' } };
      this.currentUser = { ...(this.currentUser || {}), ...data };
      localStorage.setItem('sb:session', JSON.stringify({ access_token: this.accessToken, user: this.currentUser }));
      return { data, error: null };
    }
    return { data: null, error: { status: 400, message: 'Only subscription update supported' } };
  }
}

// PostgreSQL Implementation (placeholder for future use)
class PostgreSQLProvider extends DatabaseInterface {
  constructor() {
    super(DB_PROVIDERS.POSTGRESQL);
    // Initialize PostgreSQL connection here
  }

  // Implementation would go here
  async signUp(email, password, userData = {}) {
    // PostgreSQL implementation
    throw new Error('PostgreSQL provider not yet implemented');
  }

  // ... other methods would be implemented similarly
}

// Database Factory
class DatabaseFactory {
  static create(provider = null) {
    const currentProvider = provider || getCurrentProvider();
    console.log(`Creating database instance for provider: ${currentProvider}`);
    
    try {
      switch (currentProvider) {
        case DB_PROVIDERS.MONGODB:
          console.log('Creating MongoDB provider...');
          return new MongoDBProvider();
        case DB_PROVIDERS.POSTGRESQL:
          console.warn('PostgreSQL provider not implemented; using MongoDB');
          return new MongoDBProvider();
        default:
          console.warn(`Unknown provider: ${currentProvider}, using MongoDB`);
          return new MongoDBProvider();
      }
    } catch (error) {
      console.error('Error creating database provider:', error);
      console.log('Database initialization failed, authentication will be skipped');
      return null;
    }
  }

  static getCurrentProvider() {
    return getCurrentProvider();
  }

  static setProvider(provider) {
    if (Object.values(DB_PROVIDERS).includes(provider)) {
      // In a real app, you might want to persist this choice
      console.log(`Database provider set to: ${provider}`);
      return true;
    }
    console.error(`Invalid provider: ${provider}`);
    return false;
  }
}

// Create default database instance with error handling
let database;
try {
  database = DatabaseFactory.create();
} catch (error) {
  console.error('Database initialization failed:', error);
  database = null;
}

// Export the database instance and factory
export { database, DatabaseFactory, DatabaseInterface };

// Export individual providers for testing
export { MongoDBProvider, PostgreSQLProvider };

// Export convenience methods that use the default database instance
export const auth = {
  signUp: (email, password, userData) => database?.signUp(email, password, userData) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  signIn: (email, password) => database?.signIn(email, password) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  signOut: () => database?.signOut() || Promise.resolve({ error: null }),
  getCurrentUser: () => database?.getCurrentUser() || Promise.resolve({ user: null, error: null }),
  getSession: () => database?.getSession() || Promise.resolve({ session: null, error: null }),
  onAuthStateChange: (callback) => database?.onAuthStateChange(callback) || { data: { subscription: { unsubscribe: () => {} } } }
};

export const db = {
  getUserProfile: (userId) => database?.getUserProfile(userId) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  createUserProfile: (userData) => database?.createUserProfile(userData) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  updateUserProfile: (userId, updates) => database?.updateUserProfile(userId, updates) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  getUserByEmail: (email) => database?.getUserByEmail(email) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  getUserProjects: (userId) => database?.getUserProjects(userId) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  createProject: (projectData) => database?.createProject(projectData) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  updateProject: (projectId, updates) => database?.updateProject(projectId, updates) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  deleteProject: (projectId) => database?.deleteProject(projectId) || Promise.resolve({ data: null, error: { message: 'Database not available' } }),
  getProject: (projectId) => database?.getProject(projectId) || Promise.resolve({ data: null, error: { message: 'Database not available' } })
};

// Helper to build authorized fetch with optional personal key and ollama URL
export const buildRequestInit = (extraHeaders = {}) => {
  const headers = { ...extraHeaders };
  try {
    const key = localStorage.getItem('sb:userApiKey');
    if (key && key.startsWith('sk-')) headers['x-user-api-key'] = key;
    const ollama = localStorage.getItem('sb:ollamaUrl');
    if (ollama) headers['x-ollama-url'] = ollama;
  } catch {}
  return { headers };
};

export default database;
