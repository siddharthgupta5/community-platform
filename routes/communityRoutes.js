const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authController = require('../controllers/authController');
const { validateCommunity } = require('../utils/validators');

router.get('/', communityController.getCommunities);
router.post('/', authController.protect, validateCommunity, communityController.createCommunity);
router.get('/:id/members', communityController.getCommunityMembers);
router.get('/me/owner', authController.protect, communityController.getMyOwnedCommunities);
router.get('/me/member', authController.protect, communityController.getMyJoinedCommunities);

module.exports = router;