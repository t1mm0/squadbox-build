/**
 * create_admin.js
 * Script to create an admin user in MongoDB
 */

// Suppress MongoDB deprecation warnings
process.env.MONGODB_SUPPRESS_DEPRECATION_WARNINGS = 'true';

const mongoose = require('mongoose');
const crypto = require('crypto');
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

// Connect to MongoDB and create admin user
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const User = mongoose.model('User', userSchema);
    
    try {
      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: 'admin@squadbox.uk' });
      
      if (existingAdmin) {
        console.log(JSON.stringify({
          success: false,
          message: 'Admin user already exists'
        }));
        await mongoose.connection.close();
        process.exit(0);
      }
      
      // Create admin user
      const adminUser = new User({
        username: 'admin',
        email: 'admin@squadbox.uk',
        name: 'Squadbox Admin',
        role: 'admin',
        subscription: 'unlimited',
        projectCount: 0,
        projectIds: []
      });
      
      // Set password (salt and hash)
      adminUser.salt = adminUser.makeSalt();
      adminUser.hashedPassword = adminUser.encryptPassword('admin123'); // Default password
      
      await adminUser.save();
      
      // Return success response
      console.log(JSON.stringify({
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          subscription: adminUser.subscription
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