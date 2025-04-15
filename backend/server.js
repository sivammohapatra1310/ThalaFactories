const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const machineRoutes = require('./routes/machine.routes');
const adjusterRoutes = require('./routes/adjuster.routes');
// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'https://thala-factories-m3yn.vercel.app/', // Your frontend URL
  credentials: true // Allow cookies if needed
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes); // Your existing auth routes
app.use('/api/machines', machineRoutes);
app.use('/api/adjusters', adjusterRoutes);

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/factory-simulation')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Connecting to MongoDB:', process.env.MONGODB_URI));

// API routes
app.use('/api/auth', authRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server!'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;