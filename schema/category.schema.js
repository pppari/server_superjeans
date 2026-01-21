const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับ Category
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    unique: true
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 200
  },
  fileName: {
    type: String,
    trim: true
},
subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
  ],
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
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
