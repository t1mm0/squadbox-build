/**
 * get_user.js
 * Script to get user details from MongoDB
 */

// Suppress MongoDB deprecation warnings
process.env.MONGODB_SUPPRESS_DEPRECATION_WARNINGS = 'true';

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ 
  path: require('path').resolve(__dirname, '../../.env'),
  quiet: true 
});

const MONGODB_URI = process.env.MONGODB_URI;

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
}, { collection: 'auth' });

// Connect to MongoDB and get user
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const sboxDb = mongoose.connection.useDb('sbox');
    const User = sboxDb.model('AuthUser', userSchema, 'auth');
    
    try {
      // Find user by ID
      const user = await User.findById(userData.userId);
      
      if (!user) {
        console.log(JSON.stringify({
          success: false,
          message: 'User not found'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Return success response
      console.log(JSON.stringify({
        success: true,
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