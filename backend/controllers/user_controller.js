/*
 * user_controller.js
 * Purpose: Controller for user-related operations
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../db/connection');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../../.env' });

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// Controller functions
class UserController {
  // Register a new user
  async register(req, res) {
    try {
      await connectToDatabase();
      
      const { username, email, password, name } = req.body;
      
      // Check if user already exists
      let existingUser = await User.findOne({ $or: [{ email }, { username }] });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }
      
      // Create new user
      const user = new User({
        username,
        email,
        name,
        password // This will use the virtual setter
      });
      
      await user.save();
      
      // Generate token
      const token = generateToken(user);
      
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Login user
  async login(req, res) {
    try {
      await connectToDatabase();
      
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check password
      if (!user.authenticate(password)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Generate token
      const token = generateToken(user);
      
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Get current user
  async getCurrentUser(req, res) {
    try {
      await connectToDatabase();
      
      const userId = req.user.id;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
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
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Update user subscription
  async updateSubscription(req, res) {
    try {
      await connectToDatabase();
      
      const userId = req.user.id;
      const { subscription } = req.body;
      
      if (!['free', 'basic', 'unlimited'].includes(subscription)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription type'
        });
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        { subscription },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription
        }
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();