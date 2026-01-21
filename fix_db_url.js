// สร้างไฟล์ .env ใหม่โดยเพิ่มพารามิเตอร์ที่จำเป็นสำหรับ MongoDB
const fs = require('fs');
const path = require('path');

// อ่านไฟล์ .env เดิม
const envPath = path.join(__dirname, '.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('อ่านไฟล์ .env สำเร็จ');
} catch (error) {
  console.error('ไม่สามารถอ่านไฟล์ .env:', error.message);
  process.exit(1);
}

// ตรวจสอบว่ามี DATABASE_URL หรือไม่
const dbUrlRegex = /DATABASE_URL=(.+)/;
const match = envContent.match(dbUrlRegex);

if (match) {
  const currentUrl = match[1];
  console.log('พบ DATABASE_URL ในไฟล์ .env');
  
  // ตรวจสอบว่ามีพารามิเตอร์ที่จำเป็นหรือไม่
  if (!currentUrl.includes('?retryWrites=true') && !currentUrl.includes('&retryWrites=true')) {
    // เพิ่มพารามิเตอร์ที่จำเป็น
    let newUrl = currentUrl;
    
    // ตรวจสอบว่ามีพารามิเตอร์อื่นหรือไม่
    if (currentUrl.includes('?')) {
      newUrl += '&retryWrites=true&w=majority';
    } else {
      newUrl += '?retryWrites=true&w=majority';
    }
    
    // แทนที่ URL เดิมด้วย URL ใหม่
    const newEnvContent = envContent.replace(dbUrlRegex, `DATABASE_URL=${newUrl}`);
    
    // บันทึกไฟล์ .env ใหม่
    fs.writeFileSync(envPath, newEnvContent);
    console.log('อัปเดตไฟล์ .env สำเร็จ');
    console.log('เพิ่มพารามิเตอร์ retryWrites=true และ w=majority ใน DATABASE_URL');
  } else {
    console.log('DATABASE_URL มีพารามิเตอร์ที่จำเป็นอยู่แล้ว');
  }
} else {
  console.error('ไม่พบ DATABASE_URL ในไฟล์ .env');
}
