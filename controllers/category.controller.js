const categoryModel = require('../models/category.model');
const { ObjectId } = require('mongodb');

// สร้าง Category ใหม่
const createCategory = async (req, res) => {
  try {
    // ตรวจสอบว่ามีข้อมูลส่งมาหรือไม่
    console.log('ข้อมูลที่ได้รับจาก frontend:', req.body);
   
    if (!req.body) {
      console.error('ไม่พบข้อมูลที่ส่งมา');
      return res.status(400).json({ error: 'ไม่พบข้อมูลที่ส่งมา' });
    }

 
    let data = req.body;
    
    const category = await categoryModel.createCategory(data);
    console.log('สร้างหมวดหมู่สำเร็จ:', category);
    
    res.status(201).json(category);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างหมวดหมู่:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // จัดการข้อผิดพลาดต่างๆ
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ error: 'มีหมวดหมู่นี้อยู่แล้ว' });
    } else if (error.message) {
      return res.status(500).json({ error: 'ไม่สามารถสร้างหมวดหมู่ได้', details: error.message });
    } else {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดที่ไม่รู้จัก' });
    }
  }
};

// ดึงข้อมูล Category ทั้งหมด
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้' });
  }
};

// ดึงข้อมูล Category ตาม ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID ไม่ถูกต้อง' });
    }
    const category = await categoryModel.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้' });
  }
};

// อัพเดต Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID ไม่ถูกต้อง' });
    }
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'ต้องระบุชื่อหมวดหมู่' });
    }
    
    const category = await categoryModel.updateCategory(id, { name, description });
    
    res.json(category);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตหมวดหมู่:', error);
    res.status(500).json({ error: 'ไม่สามารถอัพเดตหมวดหมู่ได้', details: error.message });
  }
};

// ลบ Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('กำลังลบหมวดหมู่ด้วย ID:', id);
    
    // ยกเลิกการตรวจสอบ ObjectId.isValid เพราะอาจทำให้เกิดปัญหากับ ID ที่ไม่ได้อยู่ในรูปแบบ ObjectId
    // การตรวจสอบจะถูกจัดการใน model แทน
    
    await categoryModel.deleteCategory(id);
    console.log('ลบหมวดหมู่สำเร็จ');
    res.status(204).send();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบหมวดหมู่:', error);
    res.status(500).json({ error: 'ไม่สามารถลบหมวดหมู่ได้', details: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
