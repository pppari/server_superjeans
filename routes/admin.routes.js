const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/', adminController.createAdmin); // Create Admin
router.post('/login', adminController.adminLogin); // Create Admin
router.post('/forgot', adminController.forgot);
router.get('/', adminController.getAllAdmins); // Get All Admins
router.get('/:id', adminController.getAdminById); // Get Admin by ID
router.put('/reset-password', adminController.reset);
router.put('/:id', adminController.updateAdmin); // Update Admin
router.put('/change-password/:userId', adminController.changePassword);
router.patch('/:id', adminController.deleteAdmin); // Delete Admin

module.exports = router;