const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authController = require('../controllers/authController');
const { validateMember } = require('../utils/validators');

// Only Admin can add members
router.post(
  '/',
  authController.protect,
  authController.isCommunityAdmin,
  validateMember,
  memberController.addMember
);

// Only Admin can remove members
router.delete(
  '/:id',
  authController.protect,
  authController.isCommunityAdmin,
  memberController.removeMember
);

module.exports = router;