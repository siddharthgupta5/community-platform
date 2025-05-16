require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/auth', require('./routes/authRoutes'));
app.use('/v1/role', require('./routes/roleRoutes'));
app.use('/v1/community', require('./routes/communityRoutes'));
app.use('/v1/member', require('./routes/memberRoutes'));

// Error handling middleware
app.use(require('./middleware/error'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));