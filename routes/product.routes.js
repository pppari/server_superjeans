const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// สร้างสินค้าใหม่
router.post('/create', productController.createProduct);
// /api/products/create

// ดึงข้อมูลสินค้าทั้งหมด
router.get('/', productController.getAllProducts);
// /api/products/

router.get('/top-product', productController.getTopProducts);
// ดึงข้อมูลสินค้าตาม ID
router.get('/:id', productController.getProductById);
//  /api/products/6809f0b19fbac73e753e9e0d

// อัพเดตสินค้า
router.put('/:id', productController.updateProduct);

// ลบสินค้า
router.patch('/:id', productController.deleteProduct);

module.exports = router;
