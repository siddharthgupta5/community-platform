const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect } = require('../middleware/auth');

router.post('/', protect, roleController.createRole);
router.get('/', roleController.getRoles);

module.exports = router;