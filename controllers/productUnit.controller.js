const productUnitService = require('../models/productUnit.model');

const createProductUnits = async (req, res) => {
  try {
    const { productId, colorId, batchId, batchCode, quantity } = req.body;

    if (!productId || !colorId || !batchId || !batchCode || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const units = await productUnitService.createProductUnits(
      productId, colorId, batchId, batchCode, quantity
    );

    res.status(201).json(units);
  } catch (error) {
    console.error('Create Product Units Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAll = async (req, res) => {
    try{
        const units = await productUnitService.getProductUnits()
        res.status(200).json(units)
    }catch (err){
        console.error(err)
        res.status(500).json(err)
    }
}

const getByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const units = await productUnitService.getProductUnitsByBatch(batchId);
    res.json(units);
  } catch (error) {
    console.error('Get Units By Batch Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getByColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const units = await productUnitService.getProductUnitsByColor(colorId);
    res.json(units);
  } catch (error) {
    console.error('Get Units By Color Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const units = await productUnitService.getProductUnitsByProduct(productId);
    res.json(units);
  } catch (error) {
    console.error('Get Units By Product Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBySerial = async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const unit = await productUnitService.getProductUnitBySerial(serialNumber);
    if (!unit) return res.status(404).json({ message: 'Not found' });
    res.json(unit);
  } catch (error) {
    console.error('Get Unit By Serial Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const { status } = req.body;
    const updated = await productUnitService.updateUnitStatus(serialNumber, status);

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    console.error('Update Unit Status Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProductUnits,
  getAll,
  getByBatch,
  getByColor,
  getByProduct,
  getBySerial,
  updateStatus,
};
