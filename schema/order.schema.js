const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    isDelivery: {
        type: Boolean,
        required: true,
        default: true
    },
    status: {
        type: String,
        required: true,
    },
    isDiscount: {
        type: Boolean,
        required: true,
        default: false
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon"
    },
    discount_amount: {
        type: Number,
        required: true,
        default: 0
    },
    payment_method: {
        type: String,
        required: true,
        enum: ["promptpay", "card"],
        default: "card"
    },
    payment_fee: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Order', OrderSchema);