const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  minimum_price: {
    type: Number,
    default: 1,
  },
  discount_type: {
    type: String,
    required: true,
    trim: true,
    enum: ['percentage', 'fixed'],
  },
  discount_amount: {
    type: Number,
    required: true,
  },
  valid_from: {
    type: Date,
    required: true,
  },
  valid_to: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Coupon", CouponSchema);
