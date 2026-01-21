const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Get current user's cart (optional but recommended)
router.get('/:id', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update item quantity
router.put('/update', cartController.updateQuantity);

// Remove item from cart
router.delete('/remove', cartController.removeItem);

module.exports = router;
