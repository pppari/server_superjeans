const express = require('express');
const router = express.Router();
const controller = require('../controllers/productUnit.controller');

// Create units
router.post('/', controller.createProductUnits);

// Get units by batch
router.get('/', controller.getAll);

// Get units by batch
router.get('/batch/:batchId', controller.getByBatch);

// Get units by color
router.get('/color/:colorId', controller.getByColor);

// Get units by product
router.get('/product/:productId', controller.getByProduct);

// Get a unit by serial number
router.get('/serial/:serialNumber', controller.getBySerial);

// Update unit status
router.put('/status/:serialNumber', controller.updateStatus);

module.exports = router;
