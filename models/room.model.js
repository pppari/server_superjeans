const Product = require('../schema/product.schema');
const Room = require('../schema/room.schema');

const getAllRooms = async () => {
    return await Room.find().sort({ createdAt: -1 });
};

const getById = async (id) => {
    return await Room.findById(id);
};

const createRoom = async (data) => {
    const room = new Room(data);
    return await room.save();
};

const updateRoom = async (id, data) => {
    return await Room.findByIdAndUpdate(id, data, { new: true });
};

const deleteRoom = async (id) => {
     const productsCount = await Product.countDocuments({
        $or: [
          { roomId: id },
          { room: id }
        ]
      });
      
      if (productsCount > 0) {
        throw new Error('ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้');
      }
    return await Room.findByIdAndDelete(id);
};

module.exports = {
    getAllRooms,
    getById,
    createRoom,
    updateRoom,
    deleteRoom,
};
