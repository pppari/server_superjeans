const addressService = require('../models/address.model');
const toObjectId = require("../utils/toObjectId");

exports.createAddress = async function (req, res) {
    try {
        const data = req.body;
        const address = await addressService.createAddress(data);

        return res.status(201).json({
            success: true,
            message: 'ที่อยู่ถูกสร้างเรียบร้อยแล้ว',
            data: address
        });
    } catch (error) {
        console.error('Controller - createAddress error:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'ไม่สามารถสร้างที่อยู่ได้',
            error: error.message
        });
    }
};

exports.getAllAddresses = async function (req, res) {
    try {
        const userId  = req.query.userId;
        const addresses = await addressService.getAllAddress(toObjectId(userId));

        return res.status(200).json(addresses);
    } catch (error) {
        console.error('Controller - getAllAddresses error:', error);
        return res.status(400).json({
            success: false,
            message: 'ไม่สามารถดึงข้อมูลที่อยู่ได้',
            error: error.message
        });
    }
};

exports.getAddressById = async function (req, res) {
    try {
        const { id } = req.params;
        const address = await addressService.getAddressById(id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบที่อยู่นี้'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'ดึงข้อมูลที่อยู่สำเร็จ',
            data: address
        });
    } catch (error) {
        console.error('Controller - getAddressById error:', error);
        return res.status(400).json({
            success: false,
            message: 'ไม่สามารถดึงข้อมูลที่อยู่ได้',
            error: error.message
        });
    }
};

exports.updateAddress = async function (req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        data.userId = req.user?.id;

        const updatedAddress = await addressService.updateAddress(id, data);

        return res.status(200).json({
            success: true,
            message: 'อัปเดตที่อยู่สำเร็จ',
            data: updatedAddress
        });
    } catch (error) {
        console.error('Controller - updateAddress error:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'ไม่สามารถอัปเดตที่อยู่ได้',
            error: error.message
        });
    }
};

exports.deleteAddress = async function (req, res) {
    try {
        const { id } = req.params;
        const deletedAddress = await addressService.deleteAddress(id);

        return res.status(200).json({
            success: true,
            message: 'ลบที่อยู่สำเร็จ',
            data: deletedAddress
        });
    } catch (error) {
        console.error('Controller - deleteAddress error:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'ไม่สามารถลบที่อยู่ได้',
            error: error.message
        });
    }
};
