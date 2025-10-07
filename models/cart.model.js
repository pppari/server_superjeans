const Cart = require('../schema/cart.schema');
const CartItem = require('../schema/cartItems.schema');
const ProductColor = require('../schema/productColor.schema');

async function calculateCartTotal(cartId) {
    const items = await CartItem.find({ cartId });
    return items.reduce((sum, item) => sum + item.total, 0);
}

exports.getCartByUserId = async (userId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) return { cart: null, items: [] };

    const items = await CartItem.find({ cartId: cart._id })
        .populate({
            path: 'productId',
            select: '_id name price sku'
        })
        .populate({
            path: 'productColorId',
            select: '_id name color_code main_img quantity'
        });

    return { cart, items };
};

exports.addToCart = async (userId, productColorId, quantity, price) => {
    const color = await ProductColor.findById(productColorId);
    if (!color || color.isDeleted) throw new Error('Product color not found');
    if (quantity > color.quantity) throw new Error('Not enough stock');

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId });

    let item = await CartItem.findOne({ cartId: cart._id, productColorId });

    if (item) {
        const newQty = item.quantity + quantity;
        if (newQty > color.quantity) throw new Error('Exceeds available stock');

        item.quantity = newQty;
        item.total = item.price * item.quantity;
        await item.save();
    } else {
        item = await CartItem.create({
            cartId: cart._id,
            productId: color.productId,
            productColorId: color._id,
            price: price || 0, // fallback
            quantity,
            total: quantity * (price || 0)
        });
    }

    cart.amount = await calculateCartTotal(cart._id);
    await cart.save();

    return item;
};

exports.updateCartItemQuantity = async (userId, productColorId, newQuantity) => {
    const color = await ProductColor.findById(productColorId);
    if (!color || color.isDeleted) throw new Error('Product color not found');
    if (newQuantity > color.quantity) throw new Error('Not enough stock');

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const item = await CartItem.findOne({ cartId: cart._id, productColorId });
    if (!item) throw new Error('Cart item not found');

    item.quantity = newQuantity;
    item.total = item.price * newQuantity;
    await item.save();

    cart.amount = await calculateCartTotal(cart._id);
    await cart.save();

    return item;
};

exports.removeItemFromCart = async (userId, productColorId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const result = await CartItem.deleteOne({ cartId: cart._id, productColorId });

    cart.amount = await calculateCartTotal(cart._id);
    await cart.save();

    return result;
};
