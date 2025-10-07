/**
 * register_user.js
 * Script to register a new user in MongoDB
 */

// Suppress MongoDB deprecation warnings
process.env.MONGODB_SUPPRESS_DEPRECATION_WARNINGS = 'true';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ 
  path: require('path').resolve(__dirname, '../../.env'),
  quiet: true 
});

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!MONGODB_URI) {
  console.error(JSON.stringify({ success: false, message: 'MongoDB URI not provided' }));
  process.exit(1);
}

// Parse command line arguments
let userData;
try {
  userData = JSON.parse(process.argv[2] || '{}');
} catch (error) {
  console.error(JSON.stringify({ success: false, message: 'Invalid JSON data' }));
  process.exit(1);
}

// Define user schema (use 'auth' collection)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    type: String,
    enum: ['free', 'basic', 'unlimited'],
    default: 'free'
  },
  projectCount: {
    type: Number,
    default: 0
  },
  projectIds: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'auth' });

// Add methods to the user schema
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Connect to MongoDB and register user
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const sboxDb = mongoose.connection.useDb('sbox');
    const User = sboxDb.model('AuthUser', userSchema, 'auth');
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [
        { email: userData.email },
        { username: userData.username }
      ]});
      
      if (existingUser) {
        console.log(JSON.stringify({
          success: false,
          message: 'User with this email or username already exists'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Create new user
      const user = new User({
        username: userData.username,
        email: userData.email,
        name: userData.name
      });
      
      // Set password (salt and hash)
      user.salt = user.makeSalt();
      user.hashedPassword = user.encryptPassword(userData.password);
      
      await user.save();
      
      // Generate token
      const token = generateToken(user);
      
      // Return success response
      console.log(JSON.stringify({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription,
          projectCount: user.projectCount
        }
      }));
      
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error(JSON.stringify({
        success: false,
        message: error.message
      }));
      await mongoose.connection.close();
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(JSON.stringify({
      success: false,
      message: `MongoDB connection error: ${error.message}`
    }));
    process.exit(1);
  });