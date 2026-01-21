const Order = require("../schema/order.schema");
const OrderItem = require("../schema/orderItems.schema");
const User = require("../schema/user.schema");
const ProductColor = require("../schema/productColor.schema");
const moment = require("moment-timezone");
const timezone = 'Asia/Bangkok';

exports.getDashboardOverview = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const monthStart = moment().startOf("month");
    const {rd} = req.query; //3d, 7d, 1m, 3m, 6m, 1y

    // 1. ยอดขายวันนี้ / เดือนนี้
    const [salesToday, salesThisMonth] = await Promise.all([
      Order.aggregate([
        { $match: { order_date: { $gte: today.toDate() } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Order.aggregate([
        { $match: { order_date: { $gte: monthStart.toDate() } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // 2. จำนวน order แต่ละสถานะ
    const orderStatusCount = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 3. จำนวน user ใหม่วันนี้ + 5 คนล่าสุด
    const [newUsersToday, latestUsers] = await Promise.all([
      User.countDocuments({ created_at: { $gte: today.toDate() } }),
      User.find().sort({ created_at: -1 }).limit(5).select("email created_at").lean(),
    ]);

    // 4. สินค้าใกล้หมด stock
    const lowStockProducts = await ProductColor.find({
      quantity: { $lte: 5 },
      isDeleted: false,
    })
      .populate("productId", "name")
      .select("name quantity");

    // 5. Top 5 จังหวัดที่ขายดี
    const topProvinces = await Order.aggregate([
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: "$address" },
      {
        $group: {
          _id: "$address.province",
          totalSales: { $sum: "$amount" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // 6. ยอดขายตามหมวดหมู่
    const salesByCategory = await OrderItem.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.categoryId",
          total: { $sum: "$total" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          categoryName: "$category.name",
          total: 1,
        },
      },
    ]);

    // 7. กราฟรายได้รายวัน / สัปดาห์ / เดือน
    let rdStartDate;
let dateFormat;

switch (rd) {
  case '3d':
  case '7d':
    rdStartDate = moment().tz(timezone).subtract(parseInt(rd), 'days').startOf('day');
    dateFormat = '%Y-%m-%d';
    break;
  case '1m':
  case '3m':
  case '6m':
    rdStartDate = moment().tz(timezone).subtract(parseInt(rd), 'months').startOf('month');
    dateFormat = '%Y-%m-%d';
    break;
  case '1y':
    rdStartDate = moment().tz(timezone).subtract(1, 'year').startOf('month');
    dateFormat = '%Y-%m';
    break;
  default:
    rdStartDate = moment().tz(timezone).subtract(7, 'days').startOf('day');
    dateFormat = '%Y-%m-%d';
}

const revenueDaily = await Order.aggregate([
  {
    $match: {
      order_date: { $gte: rdStartDate.toDate() }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: dateFormat,
          date: "$order_date",
          timezone: timezone // 👈 ใส่ตรงนี้เพื่อ normalize
        }
      },
      total: { $sum: "$amount" }
    }
  },
  { $sort: { _id: 1 } }
]);

    // 8. Top 5 สินค้าขายดีตามยอดเงิน
    const topProductsByRevenue = await OrderItem.aggregate([
      {
        $group: {
          _id: "$productId",
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          revenue: 1,
        },
      },
    ]);

    // 9. Top 5 สินค้าขายดีตามจำนวน
    const topProductsByQty = await OrderItem.aggregate([
      {
        $group: {
          _id: "$productId",
          qty: { $sum: "$quantity" },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          qty: 1,
        },
      },
    ]);

    // Response
    return res.status(200).json({
        salesToday: salesToday[0]?.total || 0,
        salesThisMonth: salesThisMonth[0]?.total || 0,
        orderStatusCount: orderStatusCount || [],
        newUsersToday: newUsersToday || 0,
        latestUsers: latestUsers || [],
        lowStockProducts: lowStockProducts || [],
        topProvinces: topProvinces || [],
        salesByCategory: salesByCategory || [],
        revenueDaily: revenueDaily || [],
        topProductsByRevenue: topProductsByRevenue || [],
        topProductsByQty: topProductsByQty || [],
      });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
