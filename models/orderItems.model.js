const OrderAItem = require('../schema/orderAItem.schema');
const mongoose = require('mongoose');

// ✅ Create OrderAItem
const createOrderAItem = async (data) => {
    try {
        const { productId, orderId, price, quantity, total } = data;

        if (!productId || !orderId || !price || !quantity || !total) {
            throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        const newItem = new OrderAItem({
            productId,
            orderId,
            price,
            quantity,
            total
        });

        return await newItem.save();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้าง OrderAItem:', error);
        throw error;
    }
};

// ✅ Get all OrderAItems (optional: filter by orderId)
const getAllOrderAItems = async (orderId = null) => {
    const filter = orderId ? { orderId } : {};
    return await OrderAItem.find(filter)
        .populate('productId')
        .populate('orderId');
};

// ✅ Get by ID
const getOrderAItemById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await OrderAItem.findById(id)
        .populate('productId')
        .populate('orderId');
};

// ✅ Update
const updateOrderAItem = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const updated = await OrderAItem.findByIdAndUpdate(id, data, { new: true });

        if (!updated) {
            throw new Error('ไม่พบรายการที่ต้องการอัปเดต');
        }

        return updated;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดต OrderAItem:', error);
        throw error;
    }
};

// ✅ Delete
const deleteOrderAItem = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const deleted = await OrderAItem.findByIdAndDelete(id);

        if (!deleted) {
            throw new Error('ไม่พบรายการที่ต้องการลบ');
        }

        return deleted;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบ OrderAItem:', error);
        throw error;
    }
};

module.exports = {
    createOrderAItem,
    getAllOrderAItems,
    getOrderAItemById,
    updateOrderAItem,
    deleteOrderAItem
};
