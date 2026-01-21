const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewScema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productColorId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductColor',
    required: true,
  },
    score: {
        type: Number,
        required: true,
    },

    message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Review', ReviewScema);