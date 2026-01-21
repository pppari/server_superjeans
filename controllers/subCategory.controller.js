const subCategoryService = require('../models/subCategory.model');

// ✅ สร้าง SubCategory
const createSubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryService.createSubCategory(req.body);
    return res.status(201).json({
      success: true,
      message: 'สร้างหมวดหมู่ย่อยสำเร็จ',
      data: subCategory
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ ดึง SubCategory ทั้งหมด
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategories();
    return res.json({
      success: true,
      data: subCategories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ ดึง SubCategory ตาม Category ID
const getSubByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await subCategoryService.getSubByCategory(categoryId);

    return res.json({
      success: true,
      data: subCategories
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await subCategoryService.getSubCategoryById(id);
    if (!subCategory) {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่ย่อย' });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ อัพเดต SubCategory
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await subCategoryService.updateSubCategory(id, req.body);

    return res.json({
      success: true,
      message: 'อัพเดตหมวดหมู่ย่อยสำเร็จ',
      data: subCategory
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ ลบ SubCategory
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await subCategoryService.deleteSubCategory(id);

    return res.json({
      success: true,
      message: 'ลบหมวดหมู่ย่อยสำเร็จ',
      data: subCategory
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubByCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory
};
