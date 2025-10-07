const express = require('express');
const router = express.Router();
const productBatchController = require('../controllers/product-batch.controller');

// สร้างล็อตสินค้าใหม่
router.post('/', productBatchController.createProductBatch);

// ดึงข้อมูลล็อตสินค้าทั้งหมด
router.get('/', productBatchController.getAllProductBatches);

// ดึงข้อมูลล็อตสินค้าตาม ID
router.get('/:id', productBatchController.getProductBatchById);

// อนุมัติล็อตสินค้า
router.put('/:id', productBatchController.updateProductBatch);

router.patch('/:id/delete', productBatchController.deleteProductBatch);


module.exports = router;
