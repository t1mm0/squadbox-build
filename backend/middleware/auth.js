/*
 * auth.js
 * Purpose: Authentication middleware for protecting routes
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../../.env' });

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  // Check if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }
  
  // Extract token (remove 'Bearer ' prefix)
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user from payload to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

/**
 * Middleware to check if user is an admin
 */
const isAdmin = (req, res, next) => {
  // First authenticate the user
  authenticate(req, res, () => {
    // Check if user is admin
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required' 
      });
    }
  });
};

/**
 * Middleware to check subscription limits for project creation
 */
const checkSubscriptionLimits = async (req, res, next) => {
  // First authenticate the user
  authenticate(req, res, async () => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      // Check subscription limits
      switch (user.subscription) {
        case 'free':
          // Free users can create only 1 project
          if (user.projectCount >= 1) {
            return res.status(403).json({ 
              success: false,
              message: 'Free subscription limit reached. Please upgrade to create more projects.' 
            });
          }
          break;
          
        case 'basic':
          // Basic users can create up to 10 projects
          if (user.projectCount >= 10) {
            return res.status(403).json({ 
              success: false,
              message: 'Basic subscription limit reached. Please upgrade to create more projects.' 
            });
          }
          break;
          
        case 'unlimited':
          // Unlimited users have no restrictions
          break;
          
        default:
          // Invalid subscription type
          return res.status(400).json({ 
            success: false,
            message: 'Invalid subscription type' 
          });
      }
      
      // If we reach here, user can create a new project
      next();
    } catch (error) {
      console.error('Error checking subscription limits:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error' 
      });
    }
  });
};

module.exports = {
  authenticate,
  isAdmin,
  checkSubscriptionLimits
};