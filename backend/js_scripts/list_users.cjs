/**
 * list_users.js
 * Script to list all users in MongoDB
 */

// Suppress MongoDB deprecation warnings
process.env.MONGODB_SUPPRESS_DEPRECATION_WARNINGS = 'true';

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables - silence dotenv logs
dotenv.config({ 
  path: require('path').resolve(__dirname, '../../.env'),
  quiet: true 
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(JSON.stringify({ success: false, message: 'MongoDB URI not provided' }));
  process.exit(1);
}

// Define user schema
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

// Connect to MongoDB and list users
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const User = mongoose.model('User', userSchema);
    
    try {
      // Find all users
      const users = await User.find({}, 'username email name role subscription projectCount');
      
      console.log(JSON.stringify({
        success: true,
        count: users.length,
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription,
          projectCount: user.projectCount
        }))
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
