const Member = require('../models/Member');
const ErrorResponse = require('../utils/errorResponse');
const Community = require('../models/Community');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Add a member to community
// @route   POST /v1/member
// @access  Private
exports.addMember = async (req, res, next) => {
  try {
    const { community, user, role } = req.body;

    // Check if community exists
    const communityExists = await Community.findOne({ id: community });
    if (!communityExists) {
      return next(new ErrorResponse('Community not found', 404));
    }

    // Check if user exists
    const userExists = await User.findOne({ id: user });
    if (!userExists) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if role exists
    const roleExists = await Role.findOne({ id: role });
    if (!roleExists) {
      return next(new ErrorResponse('Role not found', 404));
    }

    // Check if user is already a member of this community
    const existingMember = await Member.findOne({ community, user });
    if (existingMember) {
      return next(new ErrorResponse('User is already a member of this community', 400));
    }

    // Add member
    const member = await Member.create({
      community,
      user,
      role,
    });

    res.status(201).json({
      status: true,
      content: {
        data: member,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a member from community
// @route   DELETE /v1/member/:id
// @access  Private
exports.removeMember = async (req, res, next) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    
    if (!member) {
      return next(new ErrorResponse('Member not found', 404));
    }

    await member.remove();

    res.status(200).json({
      status: true,
    });
  } catch (err) {
    next(err);
  }
};