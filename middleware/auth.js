const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

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
    req.user = await User.findOne({ id: decoded.id }).select('-password');
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Check if user has admin role for a community
exports.isCommunityAdmin = async (req, res, next) => {
  try {
    const { community } = req.body;
    const adminRole = await Role.findOne({ name: 'Community Admin' });
    
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