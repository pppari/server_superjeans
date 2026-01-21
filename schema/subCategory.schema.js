const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับ Category
const subCategorySchema = new Schema({
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
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
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
const subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;
