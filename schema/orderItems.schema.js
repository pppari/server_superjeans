const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    productColorId: {
        type: Schema.Types.ObjectId,
        ref: "ProductColor",
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
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

module.exports = mongoose.model('OrderItem', OrderItemSchema);