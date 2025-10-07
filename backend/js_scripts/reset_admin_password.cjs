/**
 * reset_admin_password.js
 * Script to reset the admin user password in MongoDB
 */

// Suppress MongoDB deprecation warnings
process.env.MONGODB_SUPPRESS_DEPRECATION_WARNINGS = 'true';

const mongoose = require('mongoose');
const crypto = require('crypto');
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

// Parse command line arguments
const newPassword = process.argv[2] || 'password123';

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

// Add methods to the user schema
userSchema.methods = {
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
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

// Connect to MongoDB and reset admin password
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const User = mongoose.model('User', userSchema);
    
    try {
      // Find admin user
      const user = await User.findOne({ email: 'admin@squadbox.uk' });
      
      if (!user) {
        console.log(JSON.stringify({
          success: false,
          message: 'Admin user not found'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Update password
      user.salt = user.makeSalt();
      user.hashedPassword = user.encryptPassword(newPassword);
      await user.save();
      
      console.log(JSON.stringify({
        success: true,
        message: 'Admin password reset successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name
        },
        newPassword
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
