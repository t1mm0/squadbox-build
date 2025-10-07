/*
 * user_routes.js
 * Purpose: API routes for user authentication and management
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const { authenticate, isAdmin } = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.register);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', userController.login);

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, userController.getCurrentUser);

// @route   PUT /api/users/subscription
// @desc    Update user subscription
// @access  Private
router.put('/subscription', authenticate, userController.updateSubscription);

module.exports = router;