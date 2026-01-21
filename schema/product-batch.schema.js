const mongoose = require('mongoose');
const { getColorByProductId } = require('../controllers/productColor.controller');
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับสินค้าในล็อต
const batchProductSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  colorId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductColor'
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

// สร้าง Schema สำหรับล็อตสินค้า
const productBatchSchema = new Schema({
  batchName: {
    type: String,
    required: true,
    trim: true
  },
  batchCode: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  totalQuantity: {
    type: Number,
    default: 0
  },
  products: [batchProductSchema],
  notes: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// สร้าง model จาก Schema
const ProductBatch = mongoose.model('ProductBatch', productBatchSchema);

module.exports = {
  ProductBatch
};
