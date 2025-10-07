const express = require('express');
const orderController = require('../controllers/order.controller');
const router = express.Router();

router.post('/checkout', orderController.create);
router.get('/', orderController.findAll);
router.get('/:id', orderController.findById);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.remove);

module.exports = router;