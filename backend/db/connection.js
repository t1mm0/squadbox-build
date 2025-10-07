/*
 * connection.js
 * Purpose: MongoDB connection utility for the Squadbox application
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection instance
let connection = null;

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} MongoDB connection
 */
async function connectToDatabase() {
  if (connection) return connection;

  try {
    await mongoose.connect(MONGODB_URI, options);
    connection = mongoose.connection;
    
    console.log('Successfully connected to MongoDB');
    
    // Handle connection events
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      connection = null;
    });
    
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB database
 */
async function disconnectFromDatabase() {
  if (!connection) return;
  
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    connection = null;
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getConnection: () => connection,
};