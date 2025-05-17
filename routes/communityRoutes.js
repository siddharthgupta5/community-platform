const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect } = require('../middleware/auth');
const { validateCommunity } = require('../utils/validators');

router.get('/', communityController.getCommunities);
router.post('/', protect, validateCommunity, communityController.createCommunity);
router.get('/:id/members', communityController.getCommunityMembers);
router.get('/me/owner', protect, communityController.getMyOwnedCommunities);
router.get('/me/member', protect, communityController.getMyJoinedCommunities);

module.exports = router;