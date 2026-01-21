const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productColorImageSchema = new Schema({
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    colorId: {
        type: Schema.Types.ObjectId,
        ref: "ProductColor"
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

// สร้าง Model จาก Schema
const ProductColorImage = mongoose.model('ProductColorImage', productColorImageSchema);

module.exports = ProductColorImage;