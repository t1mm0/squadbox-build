/**
 * login_user.js
 * Script to authenticate a user in MongoDB
 */

// Suppress MongoDB deprecation warnings
process.env.MONGODB_SUPPRESS_DEPRECATION_WARNINGS = 'true';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables - silence dotenv logs to prevent corrupting JSON output
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
let loginData;
try {
  loginData = JSON.parse(process.argv[2] || '{}');
} catch (error) {
  console.error(JSON.stringify({ success: false, message: 'Invalid JSON data' }));
  process.exit(1);
}

// Define user schema (use 'auth' collection)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  name: String,
  hashedPassword: String,
  salt: String,
  role: String,
  subscription: String,
  projectCount: Number,
  projectIds: [String],
  createdAt: Date,
  updatedAt: Date
});

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

// Connect to MongoDB and login user
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const sboxDb = mongoose.connection.useDb('sbox');
    const User = sboxDb.model('AuthUser', userSchema, 'auth');
    
    try {
      // Find user by email
      const user = await User.findOne({ email: loginData.email });
      
      if (!user) {
        console.log(JSON.stringify({
          success: false,
          message: 'User not found'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Check password
      if (!user.authenticate(loginData.password)) {
        console.log(JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
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