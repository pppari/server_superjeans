// reviewController.js
const reviewService = require('../models/review.model');

// ✅ Handle creating a new review
const createReview = async (req, res) => {
  try {
    const newReview = await reviewService.createReview(req.body);
    
    res.status(201).json({
      success: true,
      data: newReview,
      message: 'รีวิวถูกสร้างเรียบร้อยแล้ว'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle fetching all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle fetching a review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await reviewService.getReviewById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรีวิว'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle fetching reviews by product ID
const getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await reviewService.getReviewsByProductId(productId);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle fetching reviews by user ID
const getReviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await reviewService.getReviewsByUserId(userId);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle updating a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedReview = await reviewService.updateReview(id, req.body);
    
    res.status(200).json({
      success: true,
      data: updatedReview,
      message: 'รีวิวถูกอัปเดตเรียบร้อยแล้ว'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle soft deleting a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    await reviewService.deleteReview(id);
    
    res.status(200).json({
      success: true,
      message: 'รีวิวถูกลบเรียบร้อยแล้ว'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle hard deleting a review (admin only)
const permanentDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    await reviewService.permanentDeleteReview(id);
    
    res.status(200).json({
      success: true,
      message: 'รีวิวถูกลบถาวรเรียบร้อยแล้ว'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Handle getting average score for a product
const getProductAverageScore = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const averageScore = await reviewService.getProductAverageScore(productId);
    
    res.status(200).json({
      success: true,
      data: { 
        productId,
        averageScore: parseFloat(averageScore.toFixed(2))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
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