// routes/room.route.js
const express = require('express');
const router = express.Router();
const productColorController = require('../controllers/productColor.controller');
const upload = require('../middlewares/mainColorImage');

router.get('/:productId', productColorController.getColor);
router.get('/getById/:colorId', productColorController.getColorById);
router.get('/byprod/:productId', productColorController.getColorByProductId);
router.post('/:productId', upload.single('image'), productColorController.createColor);
router.put('/:productId/:id', upload.single('image'), productColorController.updateColor);
router.patch('/:id', productColorController.deleteColor);

module.exports = router;
