const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productImageSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// สร้าง Model จาก Schema
const ProductImage = mongoose.model('ProductImage', productImageSchema);

module.exports = ProductImage;