// models/StockTransaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StockTransactionSchema = new Schema({
  transaction_type: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: Date,
    default: Date.now,
  },
  batchCode: {
    type: String,
    ref: "ProductBatch",
    default: null
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
    index: true,
  },
  productColorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ProductColor',
    index: true,
  },
  stock_change: {
    type: Number,
    required: true,
  },
});

// ให้แน่ใจว่า index ถูกสร้าง
StockTransactionSchema.index({ productId: 1 });

module.exports = mongoose.model('Stock', StockTransactionSchema);
