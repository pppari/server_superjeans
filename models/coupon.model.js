const Coupon = require("../schema/coupon.schema");
const mongoose = require("mongoose");

// ✅ Create Coupon
const createCoupon = async (data) => {
  try {
    if (!data || typeof data !== "object") {
      throw new Error("ข้อมูลไม่ถูกต้อง");
    }

    const {
      code,
      minimum_price = 1,
      discount_type,
      discount_amount,
      valid_from,
      valid_to,
    } = data;

    if (!code || typeof code !== "string") {
      throw new Error("กรุณาระบุรหัสคูปอง");
    }

    if (!discount_type || typeof discount_type !== "string") {
      throw new Error("กรุณาระบุประเภทส่วนลด");
    }

    if (discount_amount <= 0) {
      throw new Error("จำนวนส่วนลดต้องมากกว่า 0");
    }

    if (!valid_from || !valid_to) {
      throw new Error("กรุณาระบุช่วงวันที่ใช้งานคูปอง");
    }

    const newCoupon = new Coupon({
      code: code.trim().toUpperCase(),
      minimum_price: parseFloat(minimum_price),
      discount_type,
      discount_amount: parseFloat(discount_amount),
      valid_from,
      valid_to,
    });

    return await newCoupon.save();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้าง Coupon:", error);
    throw error;
  }
};

// ✅ Get all coupons (filter out deleted)
const getAllCoupons = async () => {
  return await Coupon.find({ isDeleted: false }).sort({ created_at: -1 });
};

const getAllCouponsUser = async (total) => {
  const totalNumber = Number(total);

  if (isNaN(totalNumber)) {
    throw new Error(`Invalid total: expected a number but got '${total}'`);
  }

  return await Coupon.find({
    isDeleted: false,
    isActive: true,
    minimum_price: { $lt: totalNumber },
    valid_from: { $lte: new Date() },
    valid_to: { $gte: new Date() }, // $lt means "less than"
  }).sort({ created_at: -1 });
};

// ✅ Get coupon by ID
const getCouponById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Coupon.findOne({ _id: id, isDeleted: false });
};

// ✅ Update coupon
const updateCoupon = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID ไม่ถูกต้อง");
    }

    data.updated_at = new Date();

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedCoupon) {
      throw new Error("ไม่พบคูปอง");
    }

    return updatedCoupon;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดต Coupon:", error);
    throw error;
  }
};

// ✅ Soft delete coupon
const deleteCoupon = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID ไม่ถูกต้อง");
    }

    const deleted = await Coupon.findByIdAndUpdate(
      id,
      { isDeleted: true, updated_at: new Date() },
      { new: true }
    );

    if (!deleted) {
      throw new Error("ไม่พบคูปองที่จะลบ");
    }

    return deleted;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบ Coupon:", error);
    throw error;
  }
};

// ✅ ตรวจสอบคูปองใช้งานได้
const validateCoupon = async (code, currentTotal) => {
  try {
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isDeleted: false,
      isActive: true,
      valid_from: { $lte: new Date() },
      valid_to: { $gte: new Date() },
    });

    if (!coupon) {
      throw new Error("ไม่พบคูปองหรือหมดอายุแล้ว");
    }

    if (currentTotal < coupon.minimum_price) {
      throw new Error(`ยอดซื้อขั้นต่ำต้องมากกว่า ${coupon.minimum_price} บาท`);
    }

    return coupon;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getAllCouponsUser,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
