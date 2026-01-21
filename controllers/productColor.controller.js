const { default: mongoose } = require('mongoose');
const productColorService = require('../models/productColor.model');
const path = require('path')
const fs = require('fs')
const upload = require('../middlewares/mainColorImage');

// Get all Color
const getColor = async (req, res) => {
    const {productId} = req.params;
    try {
        const color = await productColorService.getAll(new mongoose.Types.ObjectId(productId));
        res.status(200).json(color);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getColorById = async (req, res) => {
    const {colorId} = req.params;
    try {
        const color = await productColorService.getById(new mongoose.Types.ObjectId(colorId));
        res.status(200).json(color);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getColorByProductId = async (req, res) => {
    const {productId} = req.params;
    try {
        const color = await productColorService.getByProductId(new mongoose.Types.ObjectId(productId));
        res.status(200).json(color);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new room
const createColor = async (req, res) => {

    const { name, color_code } = req.body;
    const quantity = 0;
    const main_img = req.file.filename;
    const { productId } = req.params

    try {
        const newRoom = await productColorService.create({ name, color_code, main_img, quantity, productId });

        res.status(201).json(newRoom);
    } catch (err) {
      console.error(err)
        res.status(500).json({ message: err.message });
    }
};

// Update an existing room
const updateColor = async (req, res) => {
    const { productId, id } = req.params;
    const { name, quantity, code_color } = req.body;
    const objectId = new mongoose.Types.ObjectId(id);
  
    try {
      const existingColor = await productColorService.getById(objectId);
      if (!existingColor) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลสี' });
      }
  
      let fileName = existingColor.main_img;
  
      // If new file uploaded
      if (req.file) {
        fileName = req.file.filename;
  
        // Delete old image if exists
        if (existingColor.main_img) {
          const oldImgPath = path.resolve(__dirname, '..', 'public', 'uploads', 'product', productId, 'mainColor', existingColor.main_img);
          if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);
          }
        }
      }
  
      const updatedColor = await productColorService.update(objectId, { name, quantity, main_img: fileName, code_color });
      res.status(200).json(updatedColor);
    } catch (err) {
      console.error('Error updating room:', err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะอัปเดตข้อมูล' });
    }
  };

// Delete a room
const deleteColor = async (req, res) => {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
  
    try {
      const deletedColor = await productColorService.remove(objectId);
  
      if (!deletedColor) {
        return res.status(404).json({ message: 'ไม่พบสีที่ต้องการลบ' });
      }
  
      res.status(200).json(deletedColor);
    } catch (err) {
      console.error('Error deleting room:', err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะลบข้อมูล' });
    }
  };
  

module.exports = {
    getColor,
    getColorById,
    getColorByProductId,
    createColor,
    updateColor,
    deleteColor
};
