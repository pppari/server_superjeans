const fs = require('fs');
const path = require('path');

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// สร้างไฟล์รูปภาพตัวอย่าง
for (let i = 1; i <= 3; i++) {
  const sampleImagePath = path.join(uploadDir, `sample-image-${i}.jpg`);
  // สร้างไฟล์เปล่า
  fs.writeFileSync(sampleImagePath, '');
  console.log(`สร้างไฟล์ ${sampleImagePath} สำเร็จ`);
}

console.log('สร้างไฟล์ตัวอย่างเสร็จสิ้น');
