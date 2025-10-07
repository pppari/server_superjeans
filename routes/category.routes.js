const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// สร้างหมวดหมู่ใหม่
router.post('/', categoryController.createCategory);

// ดึงข้อมูลหมวดหมู่ทั้งหมด
router.get('/', categoryController.getAllCategories);

// ดึงข้อมูลหมวดหมู่ตาม ID
router.get('/:id', categoryController.getCategoryById);

// อัพเดตหมวดหมู่
router.put('/:id', categoryController.updateCategory);

// ลบหมวดหมู่
router.patch('/:id', categoryController.deleteCategory);

module.exports = router;
