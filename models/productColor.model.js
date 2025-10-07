const ProductColor = require('../schema/productColor.schema')

const getAll = async (productId) => {
    return await ProductColor.find({ productId: productId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
};

const getById = async (id) => {
    return await ProductColor.findById(id).populate("productId");
};
const getByProductId = async (id) => {
    return await ProductColor.find({productId: id});
};

const create = async (data) => {
    const color  = new ProductColor(data);
    return await color.save();
};

const update = async (id, data) => {
    return await ProductColor.findByIdAndUpdate(id, data, { new: true });
};

const remove = async (id) => {
    return await ProductColor.findByIdAndUpdate(id, {isDeleted: true}, { new: true });
};

module.exports = {
    getAll,
    getById,
    getByProductId,
    create,
    update,
    remove,
};