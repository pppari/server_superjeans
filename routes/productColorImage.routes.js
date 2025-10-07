const express = require('express');
const imagesController = require('../controllers/productColorImage.controller');
const router = express.Router();
const upload = require('../middlewares/colorImages')

// สร้างสินค้าใหม่
router.post('/:productId/:colorId' , upload.array('images', 5), imagesController.createImages);

// ดึงข้อมูลสินค้าทั้งหมด
router.get('/:colorId', imagesController.getAllProductImages);
// /api/products/

// ดึงข้อมูลสินค้าตาม ID
router.get('/:id', imagesController.getProductImageById);


// ลบสินค้า
router.delete('/:productId/:colorId/:id', imagesController.deleteProductImage);

router.post('/:productId/:colorId/batch-delete', imagesController.deleteSelectedProductImages);

module.exports = router;
