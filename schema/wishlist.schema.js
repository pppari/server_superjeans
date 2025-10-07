const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('WishList', WishListSchema);