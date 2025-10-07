const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getAllCouponsUser
} = require('../models/coupon.model');

// ✅ Create
const create = async (req, res) => {
  try {
    const result = await createCoupon(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Read All
const getAll = async (req, res) => {
  try {
    const result = await getAllCoupons();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const {total} = req.query;
    const result = await getAllCouponsUser(parseFloat(total));
    res.json(result);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};

// ✅ Read One
const getById = async (req, res) => {
  try {
    const result = await getCouponById(req.params.id);
    if (!result) return res.status(404).json({ message: 'ไม่พบคูปอง' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update
const update = async (req, res) => {
  try {
    const result = await updateCoupon(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete (Soft)
const remove = async (req, res) => {
  try {
    const result = await deleteCoupon(req.params.id);
    res.json({ message: 'ลบคูปองเรียบร้อย', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Validate Coupon Code
const validate = async (req, res) => {
  try {
    const { code, total } = req.query;
    if (!code || !total) {
      return res.status(400).json({ message: 'กรุณาระบุ code และ total' });
    }

    const coupon = await validateCoupon(code, parseFloat(total));
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  create,
  getAll,
  getUser,
  getById,
  update,
  remove,
  validate
};
