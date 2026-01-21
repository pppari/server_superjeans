const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// สร้างสินค้าใหม่
router.post('/create', productController.createProduct);

// ดึงข้อมูลสินค้าทั้งหมด
router.get('/', productController.getAllProducts);

// ดึงสินค้า + สี
router.get('/with-colors', productController.getProductsWithColors);


// สินค้าขายดี
router.get('/top-product', productController.getTopProducts);

// ดึงข้อมูลสินค้าตาม ID
router.get('/:id', productController.getProductById);

// อัพเดตสินค้า
router.put('/:id', productController.updateProduct);

// ลบสินค้า
router.patch('/:id', productController.deleteProduct);

module.exports = router;
