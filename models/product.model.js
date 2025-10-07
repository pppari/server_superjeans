const Product = require('../schema/product.schema');
const mongoose = require('mongoose');
const toObjectId = require("../utils/toObjectId");
const OrderItem = require('../schema/orderItems.schema');
const productColorModel = require("./productColor.model");

// สร้าง Product
const createProduct = async (data) => {
  try {
    if (!data.categoryId || data.categoryId === '') {
      throw new Error('ข้อมูลไม่ครบถ้วน กรุณาเลือกหมวดหมู่สินค้า');
    }

    if (!mongoose.Types.ObjectId.isValid(data.categoryId)) {
      throw new Error('รูปแบบรหัสหมวดหมู่ไม่ถูกต้อง');
    }

    const productData = {
      name: data.name,
      sku: data.sku.toUpperCase(),
      description: data.description || '',
      price: parseFloat(data.price),
      weight: data.weight || '',
      material: data.material || '',
      dimensions: data.dimensions || '',
      categoryId: new mongoose.Types.ObjectId(data.categoryId),
      subCategoryId: data.subCategoryId ? new mongoose.Types.ObjectId(data.subCategoryId) : null,
      roomId: new mongoose.Types.ObjectId(data.roomId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('categoryId')
      .populate('subCategoryId')
      .populate('roomId')
      .exec();

    return populatedProduct;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างสินค้า:', error);
    throw error;
  }
};

// ดึงข้อมูล Product ทั้งหมด
const getAllProducts = async (room, category, subCategory, searchQuery) => {
  try {
    const query = { isDeleted: { $ne: true } };

    if (room) query['roomId'] = toObjectId(room);
    if (category) query['categoryId'] = toObjectId(category);
    if (subCategory) query['subCategoryId'] = toObjectId(subCategory);

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['$or'] = [
        { 'name': { $regex: searchRegex } },
        { 'sku': { $regex: searchRegex } },
      ];
    }

    const products = await Product.find(query)
      .populate('roomId')
      .populate('categoryId')
      .populate('subCategoryId')
      .sort({ createdAt: -1 })
      .exec();

    return products;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
    throw error;
  }
};

// ดึงข้อมูล Product ตาม ID
const getProductById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const product = await Product.findById(id)
      .populate('categoryId')
      .populate('subCategoryId')
      .populate('roomId')
      .exec();

    return product;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
    throw error;
  }
};

// ดึงสินค้ายอดนิยม 6 อันดับ
const getTopProducts = async () => {
  try {
    const topProductsData = await OrderItem.aggregate([
      { $group: { _id: "$productId", totalSold: { $sum: "$quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $match: { "product.isDeleted": { $ne: true } } }
    ]);

    const populatedProducts = await Promise.all(
      topProductsData.map(async (entry) => {
        const fullProduct = await Product.findById(entry.product._id)
          .populate('categoryId')
          .populate('subCategoryId')
          .populate('roomId')
          .lean();

        const colors = await productColorModel.getByProductId(toObjectId(fullProduct._id));
        const main_img = colors && colors.length > 0 ? colors[0].main_img : null;

        return {
          ...fullProduct,
          totalSold: entry.totalSold,
          main_img
        };
      })
    );

    return populatedProducts;
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงสินค้ายอดนิยม:", error);
    throw error;
  }
};

// อัพเดต Product
const updateProduct = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('รูปแบบ ID ไม่ถูกต้อง');
    }

    const updateData = {
      name: data.name,
      sku: data.sku,
      description: data.description,
      price: parseFloat(data.price),
      color: data.color,
      weight: data.weight || '',
      material: data.material || '',
      dimensions: data.dimensions || '',
      categoryId: data.categoryId ? new mongoose.Types.ObjectId(data.categoryId) : null,
      subCategoryId: data.subCategoryId ? new mongoose.Types.ObjectId(data.subCategoryId) : null,
      roomId: data.roomId ? new mongoose.Types.ObjectId(data.roomId) : null,
      updatedAt: new Date()
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('categoryId')
      .populate('subCategoryId')
      .populate('roomId')
      .exec();

    if (!updatedProduct) throw new Error('ไม่พบสินค้าที่ต้องการอัพเดต');

    return updatedProduct;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตสินค้า:', error);
    throw error;
  }
};

// ลบ Product
const deleteProduct = async (id) => {
  try {
    if (!id) throw new Error('ไม่ได้ระบุ ID ของสินค้า');

    if (typeof id === 'object' && id.$oid) id = id.$oid;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('รูปแบบ ID ไม่ถูกต้อง');

    const objectId = new mongoose.Types.ObjectId(id);

    const productToDelete = await Product.findById(objectId);
    if (!productToDelete) throw new Error('ไม่พบสินค้าที่ต้องการลบ');

    await Product.findByIdAndUpdate(objectId, { isDeleted: true }, { new: true });
    return true;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getTopProducts,
  updateProduct,
  deleteProduct
};
