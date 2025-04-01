const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.path}`);
  next();
});

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Export router
module.exports = router;