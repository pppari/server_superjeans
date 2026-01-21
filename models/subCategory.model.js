const SubCategory = require('../schema/subCategory.schema');
const Category = require('../schema/category.schema');
const mongoose = require('mongoose');
const Product = require('../schema/product.schema');
const toObjectId = require('../utils/toObjectId');

// ✅ สร้าง SubCategory
const createSubCategory = async (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('ข้อมูลไม่ถูกต้อง');
    }

    const { name, categoryId, description } = data;

    // ตรวจสอบชื่อหมวดหมู่
    if (!name || typeof name !== 'string') {
      throw new Error('ต้องระบุชื่อหมวดหมู่');
    }

    const trimmedName = name.trim();
    if (trimmedName === '') throw new Error('ชื่อหมวดหมู่ต้องไม่เป็นช่องว่าง');
    if (trimmedName.length < 2) throw new Error('ชื่อหมวดหมู่ต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
    if (trimmedName.length > 50) throw new Error('ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร');

    // ตรวจสอบคำอธิบาย
    let trimmedDescription = '';
    if (description) {
      if (typeof description !== 'string') {
        throw new Error('คำอธิบายต้องเป็นข้อความ');
      }
      trimmedDescription = description.trim();
      if (trimmedDescription.length > 200) {
        throw new Error('คำอธิบายต้องไม่เกิน 200 ตัวอักษร');
      }
    }

    // ตรวจสอบว่ามี Category หลักอยู่หรือไม่
    const existingCategory = await Category.findOne({ _id: toObjectId(categoryId), isDeleted: false });
    if (!existingCategory) throw new Error('ไม่พบหมวดหมู่หลัก');

    // สร้าง SubCategory
    const newSubCategory = new SubCategory({
      name: trimmedName,
      description: trimmedDescription,
      categoryId: toObjectId(categoryId),
    });

    // บันทึก SubCategory ก่อน แล้ว push _id เข้า Category
    const savedSubCategory = await newSubCategory.save();

    await Category.findByIdAndUpdate(categoryId, {
      $push: { subCategories: savedSubCategory._id },
    });

    return savedSubCategory;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างหมวดหมู่:', error);
    throw error;
  }
};

// ✅ ดึง SubCategory ทั้งหมด
const getAllSubCategories = async () => {
  return SubCategory.find({ isDeleted: false }).populate('categoryId').sort({ createdAt: -1 });
};

// ✅ ดึง SubCategory ตาม Category
const getSubByCategory = async (catId) => {
  if (!mongoose.Types.ObjectId.isValid(catId)) return null;
  return SubCategory.find({ isDeleted: false, categoryId: catId }).populate('categoryId');
};

const getSubCategoryById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID ไม่ถูกต้อง');
  }
  return SubCategory.findOne({ _id: id, isDeleted: false }).populate('categoryId');
};

// ✅ อัพเดต SubCategory
const updateSubCategory = async (id, data) => {
  try {
    if (!id || typeof id !== 'string') throw new Error('ระบุ ID ไม่ถูกต้อง');
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('รูปแบบ ID ไม่ถูกต้อง');
    if (!data || typeof data !== 'object') throw new Error('ข้อมูลไม่ถูกต้อง');

    const { name, description = '', categoryId } = data;

    const trimmedName = String(name).trim();
    if (trimmedName === '') throw new Error('ชื่อหมวดหมู่ต้องไม่เป็นช่องว่าง');
    if (trimmedName.length < 2) throw new Error('ชื่อหมวดหมู่ต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
    if (trimmedName.length > 50) throw new Error('ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร');

    let trimmedDescription = '';
    if (description) {
      if (typeof description !== 'string') throw new Error('คำอธิบายต้องเป็นข้อความ');
      trimmedDescription = description.trim();
      if (trimmedDescription.length > 200) throw new Error('คำอธิบายต้องไม่เกิน 200 ตัวอักษร');
    }

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) throw new Error('ไม่พบหมวดหมู่นี้');

    const updateData = {
      name: trimmedName,
      description: trimmedDescription,
      updatedAt: new Date(),
    };

    // ✅ ตรวจสอบว่าต้องเปลี่ยน categoryId หรือไม่
    if (categoryId && categoryId !== String(subCategory.categoryId)) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) throw new Error('รูปแบบ categoryId ไม่ถูกต้อง');

      const newCategory = await Category.findOne({ _id: toObjectId(categoryId), isDeleted: false });
      if (!newCategory) throw new Error('ไม่พบหมวดหมู่หลักใหม่');

      const oldCategoryId = subCategory.categoryId;

      // อัปเดต categoryId
      updateData.categoryId = toObjectId(categoryId);

      // ลบจาก Category เก่า
      await Category.findByIdAndUpdate(oldCategoryId, { $pull: { subCategories: subCategory._id } });

      // เพิ่มเข้า Category ใหม่
      await Category.findByIdAndUpdate(categoryId, { $push: { subCategories: subCategory._id } });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, updateData, { new: true });
    return updatedSubCategory;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตหมวดหมู่:', error);
    if (error.code === 11000) throw new Error('มีหมวดหมู่นี้อยู่แล้ว');
    throw error;
  }
};

// ✅ ลบ SubCategory
const deleteSubCategory = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('ระบุ ID ไม่ถูกต้อง');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('รูปแบบ ID ไม่ถูกต้อง');
    }

    const existingCategory = await SubCategory.findById(id);
    if (!existingCategory || existingCategory.isDeleted) {
      throw new Error('ไม่พบหมวดหมู่นี้');
    }

    // ตรวจสอบว่ายังมีสินค้าใน SubCategory หรือไม่
    const productsCount = await Product.countDocuments({ subCategoryId: id });
    if (productsCount > 0) {
      throw new Error('ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้');
    }

    const category = await SubCategory.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    return category;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบหมวดหมู่:', error);
    throw error;
  }
};

// ✅ export ให้ตรงกัน
module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubByCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};
