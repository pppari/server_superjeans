const multer = require('multer');
const path = require('path');
const fs = require('fs');

// กำหนดการจัดเก็บไฟล์ด้วย multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const productId = req.params.productId;
    const uploadDir = path.join(__dirname, '../public/uploads/product/' + productId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null,'main' + '-' + file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 10MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์รูปภาพเท่านั้น'), false);
    }
  }
});

module.exports = upload;
