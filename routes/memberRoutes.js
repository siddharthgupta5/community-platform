const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect, isCommunityAdmin } = require('../middleware/auth');
const { validateMember } = require('../utils/validators');

// Only Admin can add members
router.post(
  '/',
  protect,
  isCommunityAdmin,
  validateMember,
  memberController.addMember
);

// Only Admin can remove members
router.delete(
  '/:id',
  protect,
  isCommunityAdmin,
  memberController.removeMember
);

module.exports = router;