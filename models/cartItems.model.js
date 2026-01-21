const CartItem = require('../schema/cartItem.schema');
const mongoose = require('mongoose');

// ✅ Create CartItem
const createCartItem = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('ข้อมูลไม่ถูกต้อง');
        }

        const { productId, cartId, price, quantity } = data;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('productId ไม่ถูกต้อง');
        }

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('cartId ไม่ถูกต้อง');
        }

        if (typeof price !== 'number' || price <= 0) {
            throw new Error('ราคาต้องเป็นตัวเลขมากกว่า 0');
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('จำนวนสินค้าต้องมากกว่า 0');
        }

        const total = price * quantity;

        const newItem = new CartItem({
            productId,
            cartId,
            price,
            quantity,
            total
        });

        return await newItem.save();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้าง CartItem:', error);
        throw error;
    }
};

// ✅ Get all CartItems (optionally by cartId)
const getAllCartItems = async (cartId = null) => {
    const filter = {};
    if (cartId && mongoose.Types.ObjectId.isValid(cartId)) {
        filter.cartId = cartId;
    }

    return await CartItem.find(filter)
        .populate('productId')
        .sort({ _id: -1 });
};

// ✅ Get CartItem by ID
const getCartItemById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return await CartItem.findById(id).populate('productId cartId');
};

// ✅ Update CartItem
const updateCartItem = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const updateData = {};

        if (data.price && typeof data.price === 'number' && data.price > 0) {
            updateData.price = data.price;
        }

        if (data.quantity && typeof data.quantity === 'number' && data.quantity > 0) {
            updateData.quantity = data.quantity;
        }

        if (updateData.price && updateData.quantity) {
            updateData.total = updateData.price * updateData.quantity;
        } else {
            const existing = await CartItem.findById(id);
            if (!existing) throw new Error('ไม่พบ CartItem');

            updateData.total = (updateData.price || existing.price) * (updateData.quantity || existing.quantity);
        }

        const updatedItem = await CartItem.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            throw new Error('ไม่พบ CartItem');
        }

        return updatedItem;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดต CartItem:', error);
        throw error;
    }
};

// ✅ Delete CartItem
const deleteCartItem = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const deleted = await CartItem.findByIdAndDelete(id);

        if (!deleted) {
            throw new Error('ไม่พบ CartItem ที่จะลบ');
        }

        return deleted;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบ CartItem:', error);
        throw error;
    }
};

module.exports = {
    createCartItem,
    getAllCartItems,
    getCartItemById,
    updateCartItem,
    deleteCartItem
};
