require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const memberRoutes = require('./routes/memberRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/role', roleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    error: {
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));