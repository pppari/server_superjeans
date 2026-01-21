const Admin = require('../schema/admin.schema');
const mongoose = require('mongoose');
const { hashPassword } = require('../utils/passwordUtils');

// ✅ Create Admin
const createAdmin = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('ข้อมูลไม่ถูกต้อง');
        }

        const { email, password } = data;

        if (!email || typeof email !== 'string') {
            throw new Error('ต้องระบุอีเมล');
        }

        if (!password || typeof password !== 'string') {
            throw new Error('ต้องระบุรหัสผ่าน');
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        const hashedPassword = await hashPassword(trimmedPassword);

        const existing = await Admin.findOne({ email: trimmedEmail });
        if (existing) {
            throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
        }

        const newAdmin = new Admin({
            email: trimmedEmail,
            password: hashedPassword,
        });

        return await newAdmin.save();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้าง Admin:', error);
        throw error;
    }
};

// ✅ Get All Admins
const getAllAdmins = async () => {
    return await Admin.find().sort({ created_at: -1 });
};

// ✅ Get Admin by ID
const getAdminById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return await Admin.findById(id);
};

const getAdminByEmail = async (email) => {
    return (await Admin.find()).filter(admin => admin.email === email)[0];
};

// ✅ Update Admin
const updateAdmin = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง', id);
        }

        const updateData = {};
        if (data.email) {
            updateData.email = data.email.trim().toLowerCase();
        }
        if (data.password) {
            updateData.password = data.password.trim();
        }
        if (typeof data.isVerified === 'boolean') {
            updateData.isVerified = data.isVerified;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedAdmin) {
            throw new Error('ไม่พบผู้ดูแลระบบ');
        }

        return updatedAdmin;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัพเดต Admin:', error);
        throw error;
    }
};

// ✅ Delete Admin (ลบจริง)
const deleteAdmin = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID ไม่ถูกต้อง');
        }

        const deleted = await Admin.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deleted) {
            throw new Error('ไม่พบผู้ดูแลระบบ');
        }

        return deleted;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบ Admin:', error);
        throw error;
    }
};

module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    getAdminByEmail,
    updateAdmin,
    deleteAdmin
};
