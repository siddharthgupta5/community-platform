const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateSignin } = require('../utils/validators');
const { protect } = require('../middleware/auth');

router.post('/signup', validateSignup, authController.signup);
router.post('/signin', validateSignin, authController.signin);
router.get('/me', protect, authController.getMe);

module.exports = router;