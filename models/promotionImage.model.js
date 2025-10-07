const PromotionImage = require('../schema/promotionImage.schema');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads/promotion/');

const createImage = async (file) => {
  if (!file) throw new Error('No file uploaded');

  const newImage = new PromotionImage({
    filename: file.filename,
  });

  return await newImage.save();
};

const deleteImage = async (id) => {
  const image = await PromotionImage.findById(id);
  if (!image) throw new Error('Image not found');

  const filePath = path.join(uploadDir, image.filename);

  // Remove image file from disk
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return await PromotionImage.findByIdAndDelete(id);
};

// Get all images
const getAllImages = async () => {
  return await PromotionImage.find({}).sort({createdAt: -1});
};

module.exports = {
  createImage,
  deleteImage,
  getAllImages,
};
