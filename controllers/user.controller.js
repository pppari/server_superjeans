const userModel = require('../models/user.model');
const toObjectId = require('../utils/toObjectId');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
            message: 'ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.getUserById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ใช้'
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'ดึงข้อมูลผู้ใช้สำเร็จ'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await userModel.createUser(userData);
        
        res.status(201).json({
            success: true,
            data: newUser,
            message: 'สร้างผู้ใช้สำเร็จ'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้',
            error: error.message
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedUser = await userModel.updateUser(id, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.deleteUser(toObjectId(id));
        
        res.status(200).json({
            success: true,
            message: 'ลบผู้ใช้สำเร็จ'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบผู้ใช้',
            error: error.message
        });
    }
};

// Get user by email
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ใช้ที่มีอีเมลนี้'
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'ดึงข้อมูลผู้ใช้สำเร็จ'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail
}; 