const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    productColorId: {
        type: Schema.Types.ObjectId,
        ref: "ProductColor",
        required: true
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('CartItem', CartItemSchema);