// แก้ไขปัญหา MongoDB Replica Set
require('dotenv').config();

console.log('DATABASE_URL ปัจจุบัน (เซ็นเซอร์):', process.env.DATABASE_URL ? 'มีค่า' : 'ไม่มีค่า');

// ตรวจสอบว่า URL มีพารามิเตอร์ replicaSet หรือไม่
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('replicaSet')) {
  console.log('ไม่พบพารามิเตอร์ replicaSet ใน DATABASE_URL');
  console.log('กรุณาแก้ไขไฟล์ .env และเพิ่มพารามิเตอร์ ?replicaSet=rs0 ต่อท้าย DATABASE_URL');
  console.log('ตัวอย่าง: mongodb://username:password@localhost:27017/database?replicaSet=rs0');
} else {
  console.log('พบพารามิเตอร์ replicaSet ใน DATABASE_URL แล้ว');
}

// ตรวจสอบการเชื่อมต่อกับ MongoDB
const { MongoClient } = require('mongodb');

async function checkConnection() {
  try {
    const client = new MongoClient(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('เชื่อมต่อกับ MongoDB สำเร็จ');
    await client.close();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับ MongoDB:', error.message);
  }
}

checkConnection();
