const { ProductBatch } = require('../schema/product-batch.schema');
const productColorModel = require('./productColor.model')
const productUnitModel = require('./productUnit.model')
const Stock = require('../schema/stock.schema')
const toObjectId = require('../utils/toObjectId')

const create = async (batchData) => {
  // 1. Create the batch record first.
  const batch = new ProductBatch(batchData);
  await batch.save();

  const batchCode = batch.batchCode;

  for (const productItem of batchData.products) {
    const { productId, colorId, quantity } = productItem;
    if (!productId || !colorId || !quantity) continue;

    // 2. Update color quantity
    const colorRecord = await productColorModel.getById(toObjectId(colorId));
    if (colorRecord) {
      const newQuantity = Math.max(0, colorRecord.quantity + quantity);
      await productColorModel.update(colorId, { quantity: newQuantity });
    }

    const colorCode = colorRecord.color_code;
    const sku = colorRecord.productId.sku;

    // 3. Create individual product units
    await productUnitModel.createProductUnits(
      productId,
      sku,
      colorId,
      colorCode,
      batch._id,
      batchCode,
      quantity
    );

    // 4. Create stock record for this batch item
    await Stock.create({
      transaction_type: 'นำเข้า',
      transaction_date: new Date(),
      batchCode: batchCode,
      productId: productId,
      productColorId: colorId,
      stock_change: quantity,
      productUnitId: null, // ไม่จำเป็นในกรณีแบบกลุ่ม แต่ใส่ null ไว้
      batchId: batch._id,
    });
  }

  return batch;
};


const getAll = async (filter = {}, options = {}) => {
  try {
    return await ProductBatch.find({isDeleted: {$ne: true}});
  } catch (error) {
    throw new Error(`Get ProductBatches failed: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    return await ProductBatch.findById(id).populate('products.productId').populate('products.colorId');
  } catch (error) {
    throw new Error(`Get ProductBatch by ID failed: ${error.message}`);
  }
};

const update = async (batchId, newData) => {
  try {
    const existingBatch = await ProductBatch.findById(toObjectId(batchId)).lean();
    const updates = [];

    for (const newItem of newData.products) {
      const existingItem = existingBatch.products.find(
        (p) =>
          p.productId.toString() === newItem.productId &&
          p.colorId.toString() === newItem.colorId
      );

      if (existingItem) {
        const diff = newItem.quantity - existingItem.quantity;

        if (diff > 0) {
          // If new quantity is greater than the existing quantity, increase color quantity
          console.log(`Increasing color ${newItem.colorId} by ${diff} units`);
          updates.push(
            productColorModel.update(
              { _id: toObjectId(newItem.colorId) },
              { $inc: { quantity: diff } }
            )
          );
        } else if (diff < 0) {
          // If new quantity is less than the existing quantity, decrease color quantity
          console.log(`Decreasing color ${newItem.colorId} by ${-diff} units`);
          updates.push(
            productColorModel.update(
              { _id: toObjectId(newItem.colorId) },
              { $inc: { quantity: diff } } // Note: `diff` is negative, so it will decrease
            )
          );
        }
      } else {
        // New item added → reduce stock
        updates.push(
          productColorModel.update(
            { _id: toObjectId(newItem.colorId) },
            { $inc: { quantity: -newItem.quantity } }
          )
        );
      }
    }

    // Handle removed items — restore quantity for color if product was removed
    for (const oldItem of existingBatch.products) {
      const stillExists = newData.products.find(
        (p) =>
          p.productId === oldItem.productId.toString() &&
          p.colorId === oldItem.colorId.toString()
      );

      if (!stillExists) {
        // Restore the quantity of the removed item to the color
        updates.push(
          productColorModel.update(
            { _id: toObjectId(oldItem.colorId) },
            { $inc: { quantity: oldItem.quantity } }
          )
        );
      }
    }

    // Apply all updates to color quantities
    await Promise.all(updates);

    // Finally, update the batch
    return await ProductBatch.findByIdAndUpdate(toObjectId(batchId), newData, { new: true });
  } catch (error) {
    throw new Error(`Failed to update product batch: ${error.message}`);
  }
};


const remove = async (id) => {
  try {
    return await ProductBatch.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  } catch (error) {
    throw new Error(`Delete ProductBatch failed: ${error.message}`);
  }
};

const approve = async (id) => {
  // Logic to approve a product batch
  return await ProductBatch.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
};

const reject = async (id) => {
  // Logic to reject a product batch
  return await ProductBatch.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  approve, // Add this
  reject,  // Add this
};
