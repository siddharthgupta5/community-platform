const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const Member = require('../models/Member');
const Community = require('../models/Community');

// @desc    Register user
// @route   POST /v1/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    // Create default roles if they don't exist
    const adminRole = await Role.findOneAndUpdate(
      { name: 'Community Admin' },
      { $setOnInsert: { name: 'Community Admin', scopes: ['all'] } },
      { upsert: true, new: true }
    );

    const memberRole = await Role.findOneAndUpdate(
      { name: 'Community Member' },
      { $setOnInsert: { name: 'Community Member', scopes: ['read'] } },
      { upsert: true, new: true }
    );

    const moderatorRole = await Role.findOneAndUpdate(
      { name: 'Community Moderator' },
      { $setOnInsert: { name: 'Community Moderator', scopes: ['read', 'write'] } },
      { upsert: true, new: true }
    );

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /v1/auth/signin
// @access  Public
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.user.id });

    res.status(200).json({
      status: true,
      content: {
        data: user,
      },
    });
  } catch (err) {
    next(err);
  }
};