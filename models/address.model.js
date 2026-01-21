const Address = require("../schema/address.schema");
const mongoose = require('mongoose');
const toObjectId = require("../utils/toObjectId");

const createAddress = async (data) => {
    try {
        // ตรวจสอบข้อมูลที่ส่งมา
        if (!data || typeof data !== 'object') {
            throw new Error('ข้อมูลไม่ถูกต้อง');
        }

        const { userId, fullname, phone, address, tambon, amphure, province, zip_code } = data;

        // ตรวจสอบชื่อ
        if (!fullname || typeof fullname !== 'string') {
            throw new Error('ต้องระบุชื่อ');
        }

        // ตัดช่องว่างและตรวจสอบความถูกต้อง
        const trimmedName = fullname.trim();
        if (trimmedName.length < 2) {
            throw new Error('ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
        }
        if (trimmedName.length > 50) {
            throw new Error('ชื่อต้องไม่เกิน 50 ตัวอักษร');
        }

        try {
            const addressData = {
                userId: toObjectId(userId),
                fullname: trimmedName,
                phone: phone,
                address: address,
                tambon: tambon,
                amphure: amphure,
                province: province,
                zip_code: zip_code,
            };

            // Declare the 'address' variable and initialize it
            const newAddress = new Address(addressData);
            const savedAddress = await newAddress.save(); // Save the address to the database

            return savedAddress; // Return the saved address
        } catch (mongooseError) {
            console.error('เกิดข้อผิดพลาดใน Mongoose:', {
                code: mongooseError.code,
                message: mongooseError.message
            });
            throw mongooseError;
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้าง:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        throw error;
    }
};

// ดึงข้อมูล Address ทั้งหมด
const getAllAddress = async (userId) => {
    return Address.find({ userId: userId, isDeleted: false }).sort({ created_at: 1 });
};

// ดึงข้อมูล Address ตาม ID
const getAddressById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return Address.findById(id);
};

// อัพเดต Address
const updateAddress = async (id, data) => {
    try {
        // ตรวจสอบ ID
        if (!id || typeof id !== 'string') {
            throw new Error('ระบุ ID ไม่ถูกต้อง');
        }

        // ตรวจสอบข้อมูลที่ส่งมา
        if (!data || typeof data !== 'object') {
            throw new Error('ข้อมูลไม่ถูกต้อง');
        }

        const { userId, fullname, phone, address, tambon, amphure, province, zip_code } = data;

        // ตรวจสอบชื่อ
        if (!fullname || typeof fullname !== 'string') {
            throw new Error('ต้องระบุชื่อ');
        }

        // ตัดช่องว่างและตรวจสอบความถูกต้อง
        const trimmedName = String(fullname).trim();  // Fixed: changed 'name' to 'fullname'
        if (trimmedName === '') {
            throw new Error('ชื่อต้องไม่เป็นช่องว่าง');
        }
        if (trimmedName.length < 2) {
            throw new Error('ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
        }
        if (trimmedName.length > 50) {
            throw new Error('ชื่อต้องไม่เกิน 50 ตัวอักษร');
        }

        // อัพเดต
        console.log('กำลังอัพเดต:', { id, name: trimmedName });

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('รูปแบบ ID ไม่ถูกต้อง');
            }

            const updateData = {
                userId: userId,
                fullname: trimmedName,
                phone: phone,
                address: address,
                tambon: tambon,
                amphure: amphure,
                province: province,
                zip_code: zip_code,
            };

            const result = await Address.findByIdAndUpdate(
                id,
                updateData,
                { new: true } // ส่งข้อมูลที่อัพเดตแล้วกลับมา
            );

            if (!result) {
                throw new Error('ไม่พบนี้');
            }

            console.log('อัพเดตสำเร็จ:', result);
            return result;
        } catch (mongooseError) {
            console.error('เกิดข้อผิดพลาดในการอัพเดต:', mongooseError);
            throw mongooseError;
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);

        if (error.code === 11000) { // MongoDB duplicate key error
            throw new Error('มีที่อยู่นี้อยู่แล้ว');
        } else if (error.message) {
            throw error;
        } else {
            throw new Error('ไม่สามารถอัพเดตได้');
        }
    }
};

// ลบ address
const deleteAddress = async (id) => {
    try {
        // ตรวจสอบ ID
        if (!id || typeof id !== 'string') {
            throw new Error('ระบุ ID ไม่ถูกต้อง');
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('รูปแบบ ID ไม่ถูกต้อง');
        }

        // ตรวจสอบว่ามีที่อยู่นี้หรือไม่
        const existingaddress = await Address.findById(id);

        if (!existingaddress || existingaddress.isDeleted) {
            throw new Error('ไม่พบที่อยู่นี้');
        }

        // ลบ
        console.log('กำลังลบ:', { id });
        const address = await Address.findByIdAndUpdate(
            id,
            { isDeleted: true }, // update isDeleted to true
            { new: true } // return the updated document
        );
        console.log('ลบสำเร็จ:', address);
        return address;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบ:', error);

        if (error.message) {
            throw error;
        } else {
            throw new Error('ไม่สามารถลบได้');
        }
    }
};

module.exports = {
    createAddress,
    getAllAddress,
    getAddressById,
    updateAddress,
    deleteAddress
};
