const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับ Product
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: String,
    default: '',
    trim: true
  },
  material: {
    type: String,
    default: '',
    trim: true
  },
  dimensions: {
    type: String,
    default: '',
    trim: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'subCategory'
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// สร้าง Model จาก Schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

/* 

Product ข้อมูลเบื้องต้น เช่น ชื่อ คำอธิบาย ประเภท ห้อง ขนาด น้ำหนัก

Variant ข้อมูลเชิงลึก เช่น สี ราคา stock ขนาด รูปภาพ

Product -> Variant[1], Variant[2] -> variantImages[1 ,2 ,3]


Product = iPhone 16 -> 40,000 ฿

Variant = ความจุ

Variant[1] = 256 GB + 0 ฿
Variant[2] = 512 GB + 2000 ฿
Variant[3] = 1 TB + 5000 ฿

-------------------------------------

Product = iPhone 16

Variant = ความจุ

Variant[1] = 256 GB -> 40,000 ฿
Variant[2] = 512 GB ->  42,000 ฿
Variant[3] = 1 TB ->  45,000 ฿

*/
