const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// ===========================
// 🔐 SIGNUP Controller
// ===========================
exports.signup = async (req, res) => {
  try {
    console.log('Signup request received:', req.body);

    const { username, password, usertype } = req.body;

    // Basic validation
    if (!username || !password || !usertype) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, password, and usertype are required'
      });
    }

    // Check for duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Username already exists'
      });
    }

    // Create user
    const newUser = await User.create({ username, password, usertype });

    // Generate JWT token
    const token = generateToken(newUser._id);

    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          usertype: newUser.usertype
        }
      }
    });
  } catch (error) {
    console.error('Error in signup controller:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred during signup'
    });
  }
};

// ===========================
// 🔐 LOGIN Controller
// ===========================
exports.login = async (req, res) => {
  try {
    const { username, password, usertype } = req.body;

    if (!username || !password || !usertype) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, password, and usertype are required'
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    // Check usertype match
    if (user.usertype !== usertype) {
      return res.status(401).json({
        status: 'error',
        message: 'Usertype does not match'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          usertype: user.usertype
        }
      }
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

// ===========================
// 🔒 PROTECT Middleware
// ===========================
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};
