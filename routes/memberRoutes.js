const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authController = require('../controllers/authController');
const { validateMember } = require('../utils/validators');

router.post(
  '/',
  authController.protect,
  authController.isCommunityAdmin,
  validateMember,
  memberController.addMember
);

router.delete(
  '/:id',
  authController.protect,
  authController.isAdminOrModerator,
  memberController.removeMember
);

module.exports = router;

