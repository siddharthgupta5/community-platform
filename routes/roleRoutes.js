const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authController = require('../controllers/authController');

router.post('/', authController.protect, roleController.createRole);
router.get('/', roleController.getRoles);

module.exports = router;