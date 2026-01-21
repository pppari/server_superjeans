const express = require('express');
const router = express.Router();
const categoryRoutes = require('./category.routes');
const subCategoryRoutes = require('./subCategory.routes');
const productRoutes = require('./product.routes');
const productColorImageRoutes = require('./productColorImage.routes');
const productBatchRoutes = require('./product-batch.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes'); // Import admin routes
const roomRoutes = require('./room.routes'); // Import admin routes
const productColorRoutes = require('./productColor.routes'); // Import admin routes
const productUnitRoutes = require('./productUnit.routes'); // Import admin routes
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');
const addressRoutes = require('./address.routes');
const wishlistRoutes = require('./wishlist.routes');
const reviewRoutes = require('./review.routes'); // Import review routes
const couponRoutes = require('./coupon.routes');
const userRoutes = require('./user.routes');
const stockRoutes = require('./stock.routes');
const dashboardRoutes = require('./dashboard.routes');
const promotionImageRoutes = require('./promotionImage.routes')

// กำหนด routes หลัก
router.use('/categories', categoryRoutes);
router.use('/sub-categories', subCategoryRoutes);
router.use('/products', productRoutes);
router.use('/productColorImg', productColorImageRoutes);
router.use('/product-batches', productBatchRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes); // Admin routes
router.use('/rooms', roomRoutes); // Admin routes
router.use('/productColor', productColorRoutes); // Admin routes
router.use('/productUnit', productUnitRoutes); // Admin routes
router.use("/auth", authRoutes)
router.use('/cart', cartRoutes)
router.use('/address', addressRoutes)
router.use('/wishlist', wishlistRoutes) // Wishlist routes
router.use('/review', reviewRoutes)
router.use('/coupon', couponRoutes)
router.use('/users', userRoutes)
router.use('/stock', stockRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/promotion-images', promotionImageRoutes)
// Route หลัก
router.get('/', (req, res) => {
  res.send('ยินดีต้อนรับสู่ API ร้านค้าออนไลน์!');
});

module.exports = router;
