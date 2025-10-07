// models/ProductUnit.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const promotionImage = new Schema({
  filename: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

promotionImage.index({ serialNumber: 1 }); // เพิ่ม index สำหรับค้นหา serial เร็วขึ้น

module.exports = mongoose.model('PromotionImage', promotionImage);
