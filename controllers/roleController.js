const Role = require('../models/Role');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a role
// @route   POST /v1/role
// @access  Private
exports.createRole = async (req, res, next) => {
  try {
    const { name, scopes } = req.body;

    const role = await Role.create({
      name,
      scopes: scopes || [],
    });

    res.status(201).json({
      status: true,
      content: {
        data: role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all roles
// @route   GET /v1/role
// @access  Public
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ created_at: -1 });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: roles.length,
          pages: 1,
          page: 1,
        },
        data: roles,
      },
    });
  } catch (err) {
    next(err);
  }
};