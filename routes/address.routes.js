const express = require('express');
const router = express.Router();

const addressController = require('../controllers/address.controller');


router.post('/create', addressController.createAddress);
router.get('/', addressController.getAllAddresses);
router.get('/:id', addressController.getAddressById);
router.put('/:id', addressController.updateAddress);
router.patch('/:id', addressController.deleteAddress);

module.exports = router;