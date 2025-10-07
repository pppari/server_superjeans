// reviewService.js
const Review = require('../schema/review.schema');
const mongoose = require('mongoose');
const toObjectId = require('../utils/toObjectId')

// ✅ Create Review
const createReview = async (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('ข้อมูลไม่ถูกต้อง');
    }
    
    const { userId, productId, orderId, productColorId, score, message } = data;
    if (!userId) {
      throw new Error('กรุณาระบุรหัสผู้ใช้');
    }
    
    if (!productId) {
      throw new Error('กรุณาระบุรหัสสินค้า');
    }
    if (!orderId) {
      throw new Error('กรุณาระบุรหัสออเดอร์');
    }
    
    if (!productColorId) {
      throw new Error('กรุณาระบุรหัสสีสินค้า');
    }
    
    if (typeof score !== 'number' || score < 1 || score > 5) {
      throw new Error('คะแนนต้องเป็นตัวเลขระหว่าง 1-5');
    }
    
    if (!message || typeof message !== 'string') {
      throw new Error('กรุณาระบุข้อความรีวิว');
    }
    
    const newReview = new Review({
      userId,
      productId,
      orderId,
      productColorId,
      score,
      message
    });
    
    return await newReview.save();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างรีวิว:', error);
    throw error;
  }
};

// ✅ Get all reviews (filter out deleted)
const getAllReviews = async () => {
  return await Review.find({ isDeleted: false })
    .populate('userId', 'name email')
    .populate('productId', 'name price')
    .populate('productColorId', 'color')
    .sort({ created_at: -1 });
};

// ✅ Get review by ID
const getReviewById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  
  return await Review.findOne({ _id: id, isDeleted: false })
    .populate('userId', 'name email')
    .populate('productId', 'name price')
    .populate('productColorId', 'color');
};

// ✅ Get reviews by product ID
const getReviewsByProductId = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return [];
  }
  
  return await Review.find({ 
    productId: productId,
    isDeleted: false
  })
  .populate('userId', 'name email')
  .sort({ created_at: -1 });
};

// ✅ Get reviews by user ID
const getReviewsByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }
  
  return await Review.find({ 
    userId: userId,
    isDeleted: false
  })
  .populate('productId', 'name price')
  .populate('productColorId', 'color')
  .sort({ created_at: -1 });
};

// ✅ Update review
const updateReview = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID ไม่ถูกต้อง');
    }
    
    // Validate score if present
    if (data.score !== undefined && (typeof data.score !== 'number' || data.score < 1 || data.score > 5)) {
      throw new Error('คะแนนต้องเป็นตัวเลขระหว่าง 1-5');
    }
    
    data.updated_at = new Date();
    
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    
    if (!updatedReview) {
      throw new Error('ไม่พบรีวิว');
    }
    
    return updatedReview;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตรีวิว:', error);
    throw error;
  }
};

// ✅ Soft delete review
const deleteReview = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID ไม่ถูกต้อง');
    }
    
    const deleted = await Review.findByIdAndUpdate(
      id,
      { isDeleted: true, updated_at: new Date() },
      { new: true }
    );
    
    if (!deleted) {
      throw new Error('ไม่พบรีวิวที่จะลบ');
    }
    
    return deleted;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบรีวิว:', error);
    throw error;
  }
};

// ✅ Hard delete review (admin only)
const permanentDeleteReview = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID ไม่ถูกต้อง');
    }
    
    const result = await Review.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error('ไม่พบรีวิวที่จะลบ');
    }
    
    return result;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบรีวิวถาวร:', error);
    throw error;
  }
};

// ✅ Get average score for a product
const getProductAverageScore = async (productId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('รหัสสินค้าไม่ถูกต้อง');
    }
    
    const result = await Review.aggregate([
      { 
        $match: { 
          productId: toObjectId(productId),
          isDeleted: false 
        } 
      },
      { 
        $group: { 
          _id: "$productId", 
          averageScore: { $avg: "$score" } 
        } 
      }
    ]);
    
    if (result.length > 0) {
      return result[0].averageScore;
    }
    return 0;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการคำนวณคะแนนเฉลี่ย:', error);
    throw error;
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  getReviewsByUserId,
  updateReview,
  deleteReview,
  permanentDeleteReview,
  getProductAverageScore
};