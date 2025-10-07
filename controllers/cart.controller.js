const cartService = require('../models/cart.model');
const toObjectId = require("../utils/toObjectId");

exports.getCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const { cart, items } = await cartService.getCartByUserId(toObjectId(userId));
        res.json({ cart, items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productColorId, quantity, userId, price } = req.body;
        const item = await cartService.addToCart(toObjectId(userId), toObjectId(productColorId), quantity, price);
        const cart = await cartService.getCartByUserId(toObjectId(userId));
        res.json({ success: true, item, cart: cart.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { productColorId, quantity, userId } = req.body;
        const item = await cartService.updateCartItemQuantity(toObjectId(userId), toObjectId(productColorId), quantity);
        res.json({ success: true, item });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const { productColorId, userId } = req.body;
        const result = await cartService.removeItemFromCart(toObjectId(userId), toObjectId(productColorId));
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};