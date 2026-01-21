const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategory.controller');

// สร้าง SubCategory
// POST /api/subcategories
router.post('/', subCategoryController.createSubCategory);

// ดึง SubCategories ทั้งหมด
// GET /api/subcategories
router.get('/', subCategoryController.getAllSubCategories);

// ดึง SubCategories ตาม Category
// GET /api/subcategories/category/:categoryId
router.get('/category/:categoryId', subCategoryController.getSubByCategory);

// ดึง SubCategory ตาม id
// GET /api/subcategories/:id
router.get('/:id', subCategoryController.getSubCategory);

// อัพเดต SubCategory
// PUT /api/subcategories/:id
router.put('/:id', subCategoryController.updateSubCategory);

// ลบ SubCategory
// DELETE /api/subcategories/:id
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
