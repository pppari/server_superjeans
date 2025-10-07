const service = require('../models/promotionImage.model');

const create = async (req, res) => {
  try {
    const file = req.file;
    const result = await service.createImage(file);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
    try{
        const result = await service.getAllImages();
        res.status(200).json({ success: true, data: result })
    }catch(err){
        console.error(err)
        res.status(400).json({ success: false, message: err.message });
    }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.deleteImage(id);
    res.status(200).json({ success: true, message: 'Image deleted', data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  create,
  remove,
  getAll
};
