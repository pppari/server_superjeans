const stockModel = require('../models/stock.model');

// Get all stock transactions
const getAllStockTransactions = async (req, res) => {
    try {
        const transactions = await stockModel.getAllStockTransactions();
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Stock Transactions',
            error: error.message
        });
    }
};

// Get specific stock transaction by ID
const getStockTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await stockModel.getStockTransactionById(id);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบรายการที่ต้องการ'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Stock Transaction',
            error: error.message
        });
    }
};

module.exports = {
    getAllStockTransactions,
    getStockTransactionById
}; 