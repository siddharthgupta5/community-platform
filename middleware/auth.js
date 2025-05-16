const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const ErrorResponse = require('../utils/errorResponse');

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: decoded.id }).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!user.isEmailVerified) {
      return next(new ErrorResponse('Please verify your email first', 403));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    }
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ErrorResponse('Refresh token is required', 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ id: decoded.id });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const tokens = generateTokens(user.id);

    res.status(200).json({
      status: true,
      content: {
        data: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        }
      }
    });
  } catch (err) {
    return next(new ErrorResponse('Invalid refresh token', 401));
  }
};

// Check if user has admin role for a community
exports.isCommunityAdmin = async (req, res, next) => {
  try {
    const { community } = req.body;
    const adminRole = await Role.findOne({ name: 'Community Admin' });
    
    if (!adminRole) {
      return next(new ErrorResponse('Admin role not found', 500));
    }

    const member = await Member.findOne({
      community,
      user: req.user.id,
      role: adminRole.id
    });

    if (!member) {
      return next(new ErrorResponse('NOT_ALLOWED_ACCESS', 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};

// Check if user has admin or moderator role for a community
exports.isAdminOrModerator = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const memberToDelete = await Member.findById(memberId);
    
    if (!memberToDelete) {
      return next(new ErrorResponse('Member not found', 404));
    }

    const adminRole = await Role.findOne({ name: 'Community Admin' });
    const moderatorRole = await Role.findOne({ name: 'Community Moderator' });
    
    if (!adminRole || !moderatorRole) {
      return next(new ErrorResponse('Roles not found', 500));
    }

    const member = await Member.findOne({
      community: memberToDelete.community,
      user: req.user.id,
      role: { $in: [adminRole.id, moderatorRole.id] }
    });

    if (!member) {
      return next(new ErrorResponse('NOT_ALLOWED_ACCESS', 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};