const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');

router.post('/', couponController.create);
router.get('/', couponController.getAll);
router.get('/user', couponController.getUser);
router.get('/validate', couponController.validate); // /validate?code=ABC&total=500
router.get('/:id', couponController.getById);
router.put('/:id', couponController.update);
router.delete('/:id', couponController.remove);

module.exports = router;
