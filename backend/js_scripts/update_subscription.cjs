/**
 * update_subscription.js
 * Script to update a user's subscription in MongoDB
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
let subscriptionData;
try {
  subscriptionData = JSON.parse(process.argv[2] || '{}');
} catch (error) {
  console.error(JSON.stringify({ success: false, message: 'Invalid JSON data' }));
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

// Connect to MongoDB and update subscription
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const User = mongoose.model('User', userSchema);
    
    try {
      // Validate subscription type
      const validSubscriptions = ['free', 'basic', 'unlimited'];
      if (!validSubscriptions.includes(subscriptionData.subscription)) {
        console.log(JSON.stringify({
          success: false,
          message: 'Invalid subscription type'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Update user's subscription
      const user = await User.findByIdAndUpdate(
        subscriptionData.userId,
        { 
          subscription: subscriptionData.subscription,
          updatedAt: new Date()
        },
        { new: true }
      );
      
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