const StockTransaction = require('../schema/stock.schema');
const mongoose = require('mongoose');

// ✅ Create StockTransaction
const createStockTransaction = async (data) => {
    try {
        const { transaction_type, transaction_date, batchCode, productId, stock_change } = data;

        if (!transaction_type || !productId || typeof stock_change !== 'number') {
            throw new Error('ข้อมูลไม่ครบถ้วน');
        }

        const transaction = new StockTransaction({
            transaction_type,
            transaction_date: transaction_date || Date.now(),
            batchCode: batchCode || null,
            productId,
            stock_change,
        });

        return await transaction.save();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้าง StockTransaction:', error);
        throw error;
    }
};

// ✅ Get All Transactions (optionally filter by productId)
const getAllStockTransactions = async (filter = {}) => {
    return await StockTransaction.find(filter)
        .populate('productId')
        .sort({ transaction_date: -1 });
};

// ✅ Get by ID
const getStockTransactionById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await StockTransaction.findById(id)
        .populate('productId');
};

// ✅ Update
const updateStockTransaction = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const updated = await StockTransaction.findByIdAndUpdate(id, data, { new: true });

        if (!updated) {
            throw new Error('ไม่พบรายการที่ต้องการอัปเดต');
        }

        return updated;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดต StockTransaction:', error);
        throw error;
    }
};

// ✅ Delete
const deleteStockTransaction = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const deleted = await StockTransaction.findByIdAndDelete(id);

        if (!deleted) {
            throw new Error('ไม่พบรายการที่ต้องการลบ');
        }

        return deleted;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบ StockTransaction:', error);
        throw error;
    }
};

module.exports = {
    createStockTransaction,
    getAllStockTransactions,
    getStockTransactionById,
    updateStockTransaction,
    deleteStockTransaction
};
