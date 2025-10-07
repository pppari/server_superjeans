const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

// Admin routes for stock reporting
router.get('/', stockController.getAllStockTransactions);
router.get('/:id', stockController.getStockTransactionById);

module.exports = router; 