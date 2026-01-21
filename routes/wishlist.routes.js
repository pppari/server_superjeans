const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

// Create a new wishlist item
router.post('/', wishlistController.create);

// Get all wishlist items by userId
router.get('/user/:userId', wishlistController.getByUserId);

// Delete a wishlist item
router.delete('/:id', wishlistController.delete);

module.exports = router;