const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productColorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color_code: {
        type: String,
        required: true,
        trim: true
    },
    main_img: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
      },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
})

// สร้าง Model จาก Schema
const ProductColor = mongoose.model('ProductColor', productColorSchema);

module.exports = ProductColor;