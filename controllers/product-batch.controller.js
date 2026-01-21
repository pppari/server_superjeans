const productBatchService = require('../models/product-batch.model');

const createProductBatch = async (req, res) => {
  try {
    const batch = await productBatchService.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message });
  }
};

const getAllProductBatches = async (req, res) => {
  try {
    const batches = await productBatchService.getAll({ isDeleted: false });
    res.status(200).json(batches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getProductBatchById = async (req, res) => {
  try {
    const batch = await productBatchService.getById(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProductBatch = async (req, res) => {
  try {
    const updated = await productBatchService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const deleteProductBatch = async (req, res) => {
  try {
    await productBatchService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProductBatch,
  getAllProductBatches,
  getProductBatchById,
  updateProductBatch,
  deleteProductBatch,
};
