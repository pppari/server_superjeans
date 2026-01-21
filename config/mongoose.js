require('dotenv').config()
const mongoose = require('mongoose');

// กำหนด URI สำหรับเชื่อมต่อกับ MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// สร้างการเชื่อมต่อกับ MongoDB
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log('เชื่อมต่อกับ MongoDB สำเร็จ');
    return connection;
  } catch (error) {
    console.error('ไม่สามารถเชื่อมต่อกับ MongoDB:', error.message);
    process.exit(1);
  }
};

// จัดการ error events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// จัดการเมื่อปิดโปรแกรม
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('ตัดการเชื่อมต่อกับ MongoDB สำเร็จ');
    process.exit(0);
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการปิดการเชื่อมต่อ:', err.message);
    process.exit(1);
  }
});

// เชื่อมต่อกับฐานข้อมูล
connectDB();

module.exports = mongoose;
