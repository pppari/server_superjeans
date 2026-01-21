const Order = require('../schema/order.schema');
const OrderItem = require('../schema/orderItems.schema');
const mongoose = require('mongoose');
const toObjectId = require('../utils/toObjectId');

// ✅ Create Order
const createOrder = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('ข้อมูลไม่ถูกต้อง');
        }
        const {
            userId,
            addressId,
            isDelivery,
            status ,
            isDiscount,
            before_discount,
            couponId,
            discount_amount,
            payment_fee,
            amount,
        } = data;

        if (!userId || !appointment || typeof payment_fee !== 'number') {
            throw new Error('ข้อมูลไม่ครบถ้วน');
        }

        const newOrder = new Order({
            userId,
            addressId,
            isDelivery,
            appointment,
            status,
            isDiscount,
            before_discount,
            couponId,
            discount_amount,
            payment_fee,
            amount
        });

        return await newOrder.save();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ:', error);
        throw error;
    }
};

// ✅ Get All Orders (optionally by user)
const getAllOrders = async (userId = null) => {
    const filter = userId ? { userId: toObjectId(userId) } : {};
  
    // Fetch orders
    const orders = await Order.find(filter)
      .populate('userId')
      .populate('addressId')
      .sort({ order_date: -1 })
      .lean(); // Make documents plain JS objects
  
    // Get all order IDs
    const orderIds = orders.map(order => order._id);
  
    // Fetch items for those orders
    const orderItems = await OrderItem.find({ orderId: { $in: orderIds } })
      .populate('productId')
      .populate('productColorId')
      .lean();
  
    // Group items by orderId
    const groupedItems = {};
    orderItems.forEach(item => {
      const id = item.orderId.toString();
      if (!groupedItems[id]) groupedItems[id] = [];
      groupedItems[id].push(item);
    });
  
    // Attach items to orders
    const merged = orders.map(order => ({
      ...order,
      items: groupedItems[order._id.toString()] || []
    }));
  
    return merged;
  };

// ✅ Get Order by ID
const getOrderById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    const order = await Order.findById(id)
        .populate('userId')
        .populate('addressId')
        .lean();
        
        const orderItems = await OrderItem.find({ orderId: { $in: id } })
        .populate('productId')
        .populate('productColorId')
        .lean();

        return {
            ...order,
            items: orderItems
        };
};

// ✅ Update Order
const updateOrder = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        data.updated_at = new Date();

        const updated = await Order.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!updated) {
            throw new Error('ไม่พบคำสั่งซื้อ');
        }

        return updated;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดต Order:', error);
        throw error;
    }
};

// ✅ Delete Order (จริง ๆ แนะนำให้ใช้ soft delete)
const deleteOrder = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const deleted = await Order.findByIdAndDelete(id);

        if (!deleted) {
            throw new Error('ไม่พบคำสั่งซื้อที่จะลบ');
        }

        return deleted;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบ Order:', error);
        throw error;
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
