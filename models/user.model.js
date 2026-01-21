const User = require('../schema/user.schema');
const mongoose = require('mongoose');

// ✅ Create User
const createUser = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error('กรุณาระบุอีเมลและรหัสผ่าน');
    }

    const user = new User({
        email: email.trim(),
        password: password.trim(),
    });

    return await user.save();
};

// ✅ Get All Users + Address
const getAllUsers = async () => {
    return await User.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        {
            $lookup: {
                from: 'addresses',        // ชื่อ collection (สำคัญ)
                localField: '_id',
                foreignField: 'userId',
                as: 'addresses'
            }
        }
    ]);
};

// ✅ Get User By ID
const getUserById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findById(id);
};

// ✅ Get User By Email
const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// ✅ Update User
const updateUser = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID ไม่ถูกต้อง');
    }

    const updated = await User.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
        throw new Error('ไม่พบผู้ใช้ที่ต้องการอัปเดต');
    }

    return updated;
};

// ✅ Delete User (soft delete)
const deleteUser = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID ไม่ถูกต้อง');
    }

    const deleted = await User.findById(id);

    if (!deleted) {
        throw new Error('ไม่พบผู้ใช้ที่ต้องการลบ');
    }

    deleted.isDeleted = true;
    await deleted.save();

    return deleted;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
};
