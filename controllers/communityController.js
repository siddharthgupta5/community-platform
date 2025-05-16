const Community = require('../models/Community');
const Member = require('../models/Member');
const Role = require('../models/Role');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all communities
// @route   GET /v1/community
// @access  Public
exports.getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find()
      .populate('owner', 'id name')
      .sort({ created_at: -1 });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: communities.length,
          pages: 1,
          page: 1,
        },
        data: communities,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a community
// @route   POST /v1/community
// @access  Private
exports.createCommunity = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // Create community
    const community = await Community.create({
      name,
      owner: req.user.id,
    });

    // Get Community Admin role
    const adminRole = await Role.findOne({ name: 'Community Admin' });

    // Add owner as admin member
    await Member.create({
      community: community.id,
      user: req.user.id,
      role: adminRole.id,
    });

    res.status(201).json({
      status: true,
      content: {
        data: community,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all members of a community
// @route   GET /v1/community/:id/members
// @access  Public
exports.getCommunityMembers = async (req, res, next) => {
  try {
    const communityId = req.params.id;

    const members = await Member.find({ community: communityId })
      .populate('user', 'id name')
      .populate('role', 'id name')
      .sort({ created_at: -1 });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: members.length,
          pages: 1,
          page: 1,
        },
        data: members,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get communities owned by current user
// @route   GET /v1/community/me/owner
// @access  Private
exports.getMyOwnedCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find({ owner: req.user.id })
      .sort({ created_at: -1 });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: communities.length,
          pages: 1,
          page: 1,
        },
        data: communities,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get communities where current user is a member
// @route   GET /v1/community/me/member
// @access  Private
exports.getMyJoinedCommunities = async (req, res, next) => {
  try {
    const memberships = await Member.find({ user: req.user.id })
      .populate('community')
      .sort({ created_at: -1 });

    const communities = memberships.map(membership => membership.community);

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: communities.length,
          pages: 1,
          page: 1,
        },
        data: communities,
      },
    });
  } catch (err) {
    next(err);
  }
};