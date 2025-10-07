// models/ProductUnit.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productUnitSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  colorId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductColor',
    required: true,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductBatch',
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['in-stock', 'sold', 'returned', 'defective'],
    default: 'in-stock',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productUnitSchema.index({ serialNumber: 1 }); // เพิ่ม index สำหรับค้นหา serial เร็วขึ้น

module.exports = mongoose.model('ProductUnit', productUnitSchema);
