const Category = require('../schema/category.schema');
const mongoose = require('mongoose');
const Product = require('../schema/product.schema');

// สร้าง Category
const createCategory = async (data) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งมา
    if (!data || typeof data !== 'object') {
      throw new Error('ข้อมูลไม่ถูกต้อง');
    }

    /* Example
    data: {
      name: "test",
      description: "testing"
    }

    const name = data.name;
    const description = data.description
    */
    const { name, description } = data;
    
    
    // ตรวจสอบชื่อหมวดหมู่
    if (!name || typeof name !== 'string') {
      throw new Error('ต้องระบุชื่อหมวดหมู่');
    }

    // ตัดช่องว่างและตรวจสอบความถูกต้อง
    const trimmedName = name.trim();
    if (trimmedName === '') {
      throw new Error('ชื่อหมวดหมู่ต้องไม่เป็นช่องว่าง');
    }
    if (trimmedName.length < 2) {
      throw new Error('ชื่อหมวดหมู่ต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
    }
    if (trimmedName.length > 50) {
      throw new Error('ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร');
    }

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

    // ตรวจสอบว่ามีชื่อหมวดหมู่ซ้ำหรือไม่
    const existingCategory = await Category.findOne({ name: trimmedName, isDeleted: false });

    if (existingCategory) {
      console.log('พบชื่อหมวดหมู่ซ้ำ:', {
        existingName: existingCategory.name,
        newName: trimmedName
      });
      throw new Error('มีหมวดหมู่นี้อยู่แล้ว');
    }

    // สร้างหมวดหมู่ใหม่
    try {
      const categoryData = {
        name: trimmedName,
        description: trimmedDescription,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newCategory = new Category(categoryData);
      const category = await newCategory.save();
      
      return category;
    } catch (mongooseError) {
      console.error('เกิดข้อผิดพลาดใน Mongoose:', {
        code: mongooseError.code,
        message: mongooseError.message
      });
      throw mongooseError;
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างหมวดหมู่:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    throw error;
  }
};

// ดึงข้อมูล Category ทั้งหมด
const getAllCategories = async () => {
  return Category.find({ isDeleted: false })
    .populate({
      path: "subCategories",   // field ที่อยู่ใน schema ของ Category
      match: { isDeleted: false }, // populate เฉพาะ subCategory ที่ไม่ถูกลบ
      select: "_id name description", // field ที่จะดึงมา
      options: { sort: { createdAt: -1 } } // sort subCategories
    })
    .sort({ createdAt: -1 });
};

// ดึงข้อมูล Category ตาม ID
const getCategoryById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return Category.findById(id);
};

// อัพเดต Category
const updateCategory = async (id, data) => {
  try {
    // ตรวจสอบ ID
    if (!id || typeof id !== 'string') {
      throw new Error('ระบุ ID ไม่ถูกต้อง');
    }

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!data || typeof data !== 'object') {
      throw new Error('ข้อมูลไม่ถูกต้อง');
    }

    const { name, description = '' } = data;
    
    // ตรวจสอบชื่อหมวดหมู่
    if (!name || typeof name !== 'string') {
      throw new Error('ต้องระบุชื่อหมวดหมู่');
    }

    // ตัดช่องว่างและตรวจสอบความถูกต้อง
    const trimmedName = String(name).trim();
    if (trimmedName === '') {
      throw new Error('ชื่อหมวดหมู่ต้องไม่เป็นช่องว่าง');
    }
    if (trimmedName.length < 2) {
      throw new Error('ชื่อหมวดหมู่ต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
    }
    if (trimmedName.length > 50) {
      throw new Error('ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร');
    }

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

    // อัพเดตหมวดหมู่
    console.log('กำลังอัพเดตหมวดหมู่:', { id, name: trimmedName, description: trimmedDescription });
    
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('รูปแบบ ID ไม่ถูกต้อง');
      }
      
      const updateData = {
        name: trimmedName,
        description: trimmedDescription,
        updatedAt: new Date()
      };
      
      const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // ส่งข้อมูลที่อัพเดตแล้วกลับมา
      );
      
      if (!category) {
        throw new Error('ไม่พบหมวดหมู่นี้');
      }
      
      console.log('อัพเดตหมวดหมู่สำเร็จ:', category);
      return category;
    } catch (mongooseError) {
      console.error('เกิดข้อผิดพลาดในการอัพเดตหมวดหมู่:', mongooseError);
      throw mongooseError;
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    
    if (error.code === 11000) { // MongoDB duplicate key error
      throw new Error('มีหมวดหมู่นี้อยู่แล้ว');
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('ไม่สามารถอัพเดตหมวดหมู่ได้');
    }
  }
};

// ลบ Category
const deleteCategory = async (id) => {
  try {
    // ตรวจสอบ ID
    if (!id || typeof id !== 'string') {
      throw new Error('ระบุ ID ไม่ถูกต้อง');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('รูปแบบ ID ไม่ถูกต้อง');
    }

    // ตรวจสอบว่ามีหมวดหมู่นี้หรือไม่
    const existingCategory = await Category.findById(id);

    if (!existingCategory || existingCategory.isDeleted) {
      throw new Error('ไม่พบหมวดหมู่นี้');
    }
    // ตรวจสอบทั้ง categoryId และ category เพื่อความแน่ใจ
    console.log('กำลังตรวจสอบสินค้าในหมวดหมู่:', id);
    
    // ใช้การตรวจสอบแบบหลายรูปแบบเพื่อให้ครอบคลุมทุกกรณี
    // ตรวจสอบว่ามีสินค้าในหมวดหมู่หรือไม่
    try {
      const productsCount = await Product.countDocuments({
        $or: [
          { categoryId: id },
          { category: id }
        ]
      });
      
      if (productsCount > 0) {
        throw new Error('ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้');
      }
      
      // ตรวจสอบแบบ ObjectId ถ้ายังไม่พบสินค้า
      try {
        const objectId = new mongoose.Types.ObjectId(id);
        const productsWithObjectId = await Product.countDocuments({
          $or: [
            { categoryId: objectId },
            { category: objectId }
          ]
        });
        
        if (productsWithObjectId > 0) {
          throw new Error('ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้');
        }
      } catch (objectIdError) {
        console.log('ไม่สามารถแปลงเป็น ObjectId ได้:', objectIdError.message);
        // ไม่ต้องทำอะไร ดำเนินการต่อไปได้
      }
    } catch (countError) {
      if (countError.message === 'ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้') {
        throw countError; // ส่งต่อข้อผิดพลาดที่มีสินค้าอยู่
      }
      console.error('เกิดข้อผิดพลาดในการตรวจสอบสินค้า:', countError);
      // ถ้าเกิดข้อผิดพลาดในการตรวจสอบ ให้ดำเนินการต่อไปโดยถือว่าไม่มีสินค้าในหมวดหมู่
    }

    // เงื่อนไขนี้ถูกย้ายไปอยู่ในบล็อก try ด้านบนแล้ว

    // ลบหมวดหมู่
    console.log('กำลังลบหมวดหมู่:', { id });
    const category = await Category.findByIdAndUpdate(
      id,
      { isDeleted: true }, // update isDeleted to true
      { new: true } // return the updated document
    );
    console.log('ลบหมวดหมู่สำเร็จ:', category);
    return category;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบหมวดหมู่:', error);

    if (error.message) {
      throw error;
    } else {
      throw new Error('ไม่สามารถลบหมวดหมู่ได้');
    }
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
