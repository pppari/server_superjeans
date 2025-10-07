require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('./config/mongoose');
const routes = require('./routes');
const initializeStripe = require('./utils/stripe');
const Order = require("./schema/order.schema");
const OrderItem = require("./schema/orderItems.schema");
const CartItem = require("./schema/cartItems.schema");
const ProductColor = require("./schema/productColor.schema");
const Cart = require("./schema/cart.schema");
const ProductUnit = require("./schema/productUnit.schema");
const Stock = require("./schema/stock.schema");
const { sendOrderNotify, sendBillingEmail } = require('./middlewares/nodemailer');
const User = require('./schema/user.schema');
const toObjectId = require('./utils/toObjectId');




const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());

//http://localhost:8002/api/webhook/stripe
app.post("/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      const stripe = await initializeStripe();
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const { type } = event;

    if (type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata;

      if (!metadata) {
        return res.status(400).send("Missing metadata in session");
      }

      try {
        const {
          cartId,
          userId,
          addressId,
          amount,
          payment_method,
          payment_fee,
          isDelivery,
          isDiscount,
          couponId,
          discount_amount
        } = metadata;

        // Step 1: Fetch cart items
        const cartItems = await CartItem.find({ cartId }).lean();
        if (!cartItems.length) {
          return res.status(404).send("No cart items found");
        }

        // Step 2: Create Order
        const newOrder = await Order.create({
          userId,
          addressId,
          isDelivery: isDelivery === "true",
          isDiscount: isDiscount === "true",
          couponId: couponId || null,
          discount_amount: parseFloat(discount_amount),
          payment_method,
          status: "รอจัดส่ง",
          payment_fee: parseFloat(payment_fee),
          amount: parseFloat(amount),
        });

        // Step 3: Process each cart item
        for (const item of cartItems) {
          await OrderItem.create({
            orderId: newOrder._id,
            productId: item.productId,
            productColorId: item.productColorId,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          });

          // ค้นหา ProductUnits ที่ยังมีใน stock
          const productUnits = await ProductUnit.find({
            productId: item.productId,
            colorId: item.productColorId,
            status: 'in-stock',
          })
            .sort({ createdAt: 1 })
            .limit(item.quantity);

          if (productUnits.length < item.quantity) {
            console.error(`❗ สินค้าไม่พอ: productId=${item.productId}, colorId=${item.productColorId}`);
            return res.status(400).send("สินค้าไม่พอในคลัง");
          }

          const unitIds = productUnits.map(unit => unit._id);

          // อัปเดตสถานะทั้งหมดเป็น sold
          await ProductUnit.updateMany(
            { _id: { $in: unitIds } },
            { $set: { status: 'sold', createdAt: new Date() } }
          );

          // สร้าง Stock แค่ 1 รายการ รวมจำนวน
          await Stock.create({
            transaction_type: 'ขายออก',
            transaction_date: new Date(),
            batchCode: productUnits[0].batchId, // ใช้ batch ของ unit แรกเป็นตัวแทน
            productId: item.productId,
            productColorId: item.productColorId,
            productUnitId: productUnits[0]._id, // หรือเก็บ array ก็ได้ ถ้าต้องการ trace ละเอียด
            stock_change: -item.quantity,
          });

          // ลดจำนวน stock ของ ProductColor
          await ProductColor.findByIdAndUpdate(
            item.productColorId,
            { $inc: { quantity: -item.quantity } },
            { new: true }
          );
        }

        // Step 4: Clear cart and send notifications
        await CartItem.deleteMany({ cartId });
        await Cart.findByIdAndDelete(cartId);

        // Send notifications
        await sendOrderNotify(newOrder._id);

        // Send billing email to customer
        const user = await User.findById(toObjectId(userId));
        if (user && user.email) {
          await sendBillingEmail(newOrder._id, user.email, {
            amount: parseFloat(amount),
            payment_fee: parseFloat(payment_fee),
            isDiscount: isDiscount === "true",
            discount_amount: parseFloat(discount_amount),
            payment_method,
            status: "รอจัดส่ง"
          });
        }

        res.status(200).json({ received: true });
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการดำเนินการ:", error.message);
        res.status(500).send("เกิดข้อผิดพลาดภายในระบบ");
      }
    } else {
      console.warn(`⚠️ ประเภทอีเวนต์ไม่ได้จัดการ: ${type}`);
      res.status(200).json({ message: "Unhandled event type" });
    }
  }
);


// เพิ่มขนาดข้อมูลที่ body-parser สามารถรับได้
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// สร้างโฟลเดอร์สำหรับเก็บรูปภาพถ้ายังไม่มี
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// กำหนดการจัดเก็บไฟล์ด้วย multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 10MB
  fileFilter: function (req, file, cb) {
    // ตรวจสอบประเภทไฟล์
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์รูปภาพเท่านั้น'), false);
    }
  }
});

// เพิ่ม middleware สำหรับจัดการไฟล์รูปภาพ
app.post('/api/upload', (req, res) => {
  console.log('ได้รับคำขออัปโหลดรูปภาพ');
  console.log('Content-Type:', req.headers['content-type']);
  
  // ตรวจสอบว่ามี multipart/form-data หรือไม่
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    console.error('ไม่ใช่ multipart/form-data');
    return res.status(400).json({ error: 'ต้องส่งข้อมูลแบบ multipart/form-data เท่านั้น' });
  }
  
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการอัปโหลด:', err.message);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      const files = req.files;
      console.log('จำนวนไฟล์ที่ได้รับ:', files ? files.length : 0);
      
      if (!files || files.length === 0) {
        console.error('ไม่พบไฟล์รูปภาพ');
        return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
      }
      
      // สร้าง URL สำหรับแต่ละไฟล์
      const fileUrls = files.map(file => {
        console.log('ไฟล์ที่อัปโหลด:', file.originalname, file.mimetype, file.size);
        return `/uploads/${file.filename}`;
      });
      
      console.log('อัปโหลดสำเร็จ:', fileUrls);
      res.status(200).json({ urls: fileUrls });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์:', error);
      res.status(500).json({ error: 'ไม่สามารถอัพโหลดไฟล์ได้' });
    }
  });
});

// ให้บริการไฟล์สถิตจากไดเรกทอรี public
app.use(express.static(path.join(__dirname, 'public')));

// ให้บริการไฟล์รูปภาพจากโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ใช้งาน routes หลัก
app.use('/api', routes);

// Route หลัก
app.get('/', (req, res) => {
  res.send('ยินดีต้อนรับสู่ API ร้านค้าออนไลน์!');
});

// Legacy API route
app.get('/api/items', (req, res) => {
  // ข้อมูลตัวอย่าง
  const items = [
    { id: 1, name: 'สินค้า 1' },
    { id: 2, name: 'สินค้า 2' },
    { id: 3, name: 'สินค้า 3' }
  ];
  res.json(items);
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
});

// จัดการการปิดระบบอย่างถูกต้อง
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('ปิดการเชื่อมต่อ MongoDB แล้ว');
  process.exit(0);
});
