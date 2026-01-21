const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const productColorModel = require("../models/productColor.model");
const toObjectId = require("../utils/toObjectId");

const mongoose = require('mongoose');

const generateSKU = async () => {
  const today = new Date();

  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const countToday = await productModel.countProductsByDate(start, end);
  const running = String(countToday + 1).padStart(3, '0');

  return `PRO-${dateStr}-${running}`;
};


// สร้าง Product ใหม่
const createProduct = async (req, res) => {
  try {
    const { name, description, price, weight, material, dimensions, categoryId, subCategoryId, roomId } = req.body;


    if (!name || !price) {
      return res.status(400).json({ error: 'ต้องระบุชื่อและราคาสินค้า' });
    }

    if (!categoryId || categoryId === '') {
      return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน กรุณาเลือกหมวดหมู่สินค้า' });
    }

    if (!require('mongoose').Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'categoryId ไม่ถูกต้องตามรูปแบบ ObjectId' });
    }

    const category = await categoryModel.getCategoryById(categoryId);
    if (!category) return res.status(404).json({ error: 'ไม่พบหมวดหมู่ที่ระบุ' });

    const product = await productModel.createProduct({
      name,
      description,
      price,
      weight,
      material,
      dimensions,
      categoryId,
      subCategoryId,
      roomId
    });


    res.status(201).json(product);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างสินค้า:', error);
    return res.status(400).json({
      error: error.message
    });
  }
};

// ดึงข้อมูล Product ทั้งหมด
const getAllProducts = async (req, res) => {
  const { r, c, sc, q } = req.query;  // r=room, c=category, sc=subCategory, q=search
  try {
    // เรียก service/model โดยส่งค่าตรงๆ
    const products = await productModel.getAllProducts(r, c, sc, q);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        // const colors = await productColorModel.getByProductId(toObjectId(product._id));
        
        const colors = await productColorModel.getByProductId(product._id);
        const mainImage = colors && colors.length > 0 ? colors[0].main_img : null;
        return { ...product.toObject(), main_img: mainImage };
      })
    );

    res.json(productsWithImages);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสินค้าได้' });
  }
};

// ดึงสินค้า + สีสินค้า
const getProductsWithColors = async (req, res) => {
  try {
    const products = await productModel.getAllProducts(null, null, null, null);

    const result = await Promise.all(
      products.map(async (product) => {
        let colors = [];

        try {
          // ✅ ต้อง assign ค่า
          colors = await productColorModel.getByProductId(product._id);
        } catch (err) {
          console.warn("ไม่พบสีของสินค้า:", product._id);
        }

        return {
          ...product.toObject(),
          colors,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("getProductsWithColors error:", error);
    res.status(500).json({ error: error.message });
  }
};



// ดึงข้อมูล Product ตาม ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'id สินค้าไม่ถูกต้อง' });
    }

    const objectId = toObjectId(id);

    const product = await productModel.getProductById(objectId);

    if (!product) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสินค้าได้' });
  }
};


// ดึงสินค้ายอดนิยม
const getTopProducts = async (req, res) => {
  try {
    const products = await productModel.getTopProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'ไม่สามารถดึงสินค้ายอดนิยมได้', error: err.message });
  }
};

// อัพเดต Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, weight, material, dimensions, categoryId, subCategoryId, roomId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'id สินค้าไม่ถูกต้อง' });
    }

    if (categoryId) {
      const category = await categoryModel.getCategoryById(categoryId);
      if (!category) return res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
    }

    const product = await productModel.updateProduct(id, {
      name,
      description,
      price,
      weight,
      material,
      dimensions,
      categoryId,
      subCategoryId,
      roomId
    });

    if (!product) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' });
    }

    res.json(product);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตสินค้า:', error);
    res.status(500).json({ error: 'ไม่สามารถอัพเดตสินค้าได้', details: error.message });
  }
};


// ลบ Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
    res.status(500).json({ error: 'ไม่สามารถลบสินค้าได้', details: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getTopProducts,
  updateProduct,
  deleteProduct,
  getProductsWithColors, // 👈 เพิ่มบรรทัดนี้
};


