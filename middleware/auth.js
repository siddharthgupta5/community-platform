const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');
const Role = require('../models/Role');
const ErrorResponse = require('../utils/errorResponse');

// General auth protection
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ id: decoded.id }).select('-password');
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Check if user is Community Admin for a specific community
exports.isCommunityAdmin = async (req, res, next) => {
  try {
    const communityId = req.body.community || req.params.id;
    
    // Find Community Admin role
    const adminRole = await Role.findOne({ name: 'Community Admin' });
    if (!adminRole) {
      return next(new ErrorResponse('System error: Admin role not configured', 500));
    }

    // Check if user has this role in the community
    const isAdmin = await Member.findOne({
      community: communityId,
      user: req.user.id,
      role: adminRole.id
    });

    if (!isAdmin) {
      return next(new ErrorResponse('NOT_ALLOWED_ACCESS', 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};