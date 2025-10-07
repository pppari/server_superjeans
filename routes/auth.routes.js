const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller')

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot', authController.forgot);
router.put('/reset-password', authController.reset);
router.put('/change-password/:userId', authController.changePassword);
router.get('/verify', authController.verify);

module.exports = router;