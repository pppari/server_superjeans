const { default: mongoose } = require('mongoose');
const roomService = require('../models/room.model');
const path = require('path')
const fs = require('fs')
const toObjectId = require("../utils/toObjectId");

// Get all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getRoomById = async (req, res) => {
    const id = req.params.id;
    try {
        const rooms = await roomService.getById(toObjectId(id));
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new room
const createRoom = async (req, res) => {

    const { name } = req.body;
    const fileName = req.file.filename

    try {
        const newRoom = await roomService.createRoom({ name, fileName });
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing room
const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const objectId = new mongoose.Types.ObjectId(id);
  
    try {
      const existingRoom = await roomService.getRoomById(objectId);
      if (!existingRoom) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }
  
      let fileName = existingRoom.fileName;
  
      // If new file uploaded
      if (req.file) {
        fileName = req.file.filename;
  
        // Delete old image if exists
        if (existingRoom.fileName) {
          const oldImgPath = path.resolve(__dirname, '..', 'public', 'uploads', 'room', existingRoom.fileName);
          if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);
          }
        }
      }
  
      const updatedRoom = await roomService.updateRoom(objectId, { name, fileName });
      res.status(200).json(updatedRoom);
    } catch (err) {
      console.error('Error updating room:', err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะอัปเดตข้อมูล' });
    }
  };

// Delete a room
const deleteRoom = async (req, res) => {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
  
    try {
      const deletedRoom = await roomService.deleteRoom(objectId);
  
      if (!deletedRoom) {
        return res.status(404).json({ message: 'ไม่พบห้องที่ต้องการลบ' });
      }
  
      const fileName = deletedRoom.fileName;
  
      if (fileName) {
        const imgPath = path.resolve(__dirname, '..', 'public', 'uploads', 'room', fileName);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
  
      res.status(200).json(deletedRoom);
    } catch (err) {
      console.error('Error deleting room:', err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะลบข้อมูล' });
    }
  };
  

module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};
