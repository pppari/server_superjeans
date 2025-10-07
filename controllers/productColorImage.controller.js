const imagesModel = require("../models/productColorImage.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const createImages = async (req, res) => {
  try {
    const { colorId } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "กรุณาอัพโหลดไฟล์รูปภาพ" });
    }
    const images = req.files;
    const productImages = images.map((image) => ({
      fileName: image.filename, // Store the filename in the database
      colorId: new mongoose.Types.ObjectId(colorId), // Associate image with the product's ID
    }));

    const savedImages = await imagesModel.createProductColorImages(productImages);
    res.status(201).json(savedImages);
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ error: err.message });
  }
};

const getAllProductImages = async (req, res) => {
  const { colorId } = req.params;
  try {
    const objectId = new mongoose.Types.ObjectId(colorId);
    const images = await imagesModel.getAll(objectId);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductImageById = async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    const image = await imagesModel.getById(objectId);
    if (!image)
      return res.status(404).json({ message: "Product image not found" });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { productId, colorId, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const image = await imagesModel.getById(objectId);

    if (!image) {
      return res.status(404).json({ message: "Product image not found" });
    }

    const filePath = path.join(__dirname, "../public/uploads", productId, colorId, image.fileName);

    // Remove the image document first
    await imagesModel.remove(objectId);

    // Then delete the file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found: ${filePath}`);
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteSelectedProductImages = async (req, res) => {
    try {
      const { ids } = req.body;
      const {productId, colorId} = req.params
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Image IDs are required" });
      }
  
      const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length) {
        return res.status(400).json({ message: "One or more image IDs are invalid", invalidIds });
      }
  
      const deleted = [];
      const notFound = [];
  
      for (const id of ids) {
        const objectId = new mongoose.Types.ObjectId(id);
        const image = await imagesModel.getById(objectId);
  
        if (!image) {
          notFound.push(id);
          continue;
        }
  
        const filePath = path.join(__dirname, "../public/uploads/product", productId, colorId, image.fileName);
  
        await imagesModel.remove(objectId);
  
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
  
        deleted.push(id);
      }
  
      res.status(200).json({
        message: "Selected images processed",
        deletedCount: deleted.length,
        notFoundCount: notFound.length,
        deleted,
        notFound,
      });
    } catch (err) {
      console.error("Error deleting selected images:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
module.exports = {
  createImages,
  getAllProductImages,
  getProductImageById,
  deleteProductImage,
  deleteSelectedProductImages
};
