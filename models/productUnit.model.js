const ProductUnit = require('../schema/productUnit.schema');
const { toObjectId } = require('../utils/toObjectId'); // ฟังก์ชัน helper แปลงเป็น ObjectId

const createProductUnits = async (productId, sku, colorId, colorCode, batchId, batchCode, quantity) => {
  const units = [];

  for (let i = 1; i <= quantity; i++) {
    const serialNumber = `${batchCode}${sku}${colorCode}${String(i).padStart(5, '0')}`;

    units.push({
      productId: productId,
      colorId: colorId,
      batchId: batchId,
      serialNumber,
    });
  }

  return await ProductUnit.insertMany(units);
};

const getProductUnits = async () => {
  return await ProductUnit.find()
  .sort({serialNumber: -1})
  .populate("batchId")
  .populate("productId")
  .populate("colorId")
  .lean();
}

const getProductUnitsByBatch = async (batchId) => {
  return await ProductUnit.find({ batchId: toObjectId(batchId) }).populate("batchId").lean();
};

const getProductUnitsByColor = async (colorId) => {
  return await ProductUnit.find({ colorId: toObjectId(colorId) }).populate("colorId").lean();
};

const getProductUnitsByProduct = async (productId) => {
  return await ProductUnit.find({ ProductId: toObjectId(productId) }).populate("productId").lean();
};


const getProductUnitBySerial = async (serialNumber) => {
  return await ProductUnit.findOne({ serialNumber }).lean();
};

const updateUnitStatus = async (serialNumber, status) => {
  return await ProductUnit.findOneAndUpdate(
    { serialNumber },
    { status },
    { new: true }
  );
};

module.exports = {
  createProductUnits,
  getProductUnits,
  getProductUnitsByBatch,
  getProductUnitsByColor,
  getProductUnitsByProduct,
  getProductUnitBySerial,
  updateUnitStatus,
};
