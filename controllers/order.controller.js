require('dotenv').config();

const { orderUpdateNotify } = require('../middlewares/nodemailer');
const orderModel = require('../models/order.model');
const userModel = require('../models/user.model');
const initializeStripe = require('../utils/stripe');
const toObjectId = require('../utils/toObjectId');

const create = async (req, res) => {
  const {
    cartId,
    cart = [],
    addressId,
    paymentMethod = "card",
    subtotal = 0,
    paymentFee = 0,
    userId,
    isDiscount = false,
    couponId = null,
    discount_amount = 0
  } = req.body;


  if (!cartId || !addressId || !userId) {
    return res.status(400).json({ message: "Missing required fields: cartId, addressId, or userId." });
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty or invalid." });
  }

  try {
    const stripe = await initializeStripe();
    const grand_total = subtotal + paymentFee;

    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
const discountPerUnit = isDiscount && totalQuantity > 0 ? discount_amount / totalQuantity : 0;

const line_items = cart.map((item, index) => {
  const { productId, productName = "Product", price, quantity } = item;

  if (!productId || typeof price !== "number" || typeof quantity !== "number") {
    throw new Error(`Invalid cart item at index ${index}.`);
  }

  const finalUnitPrice = Math.max(price - discountPerUnit, 0);

  return {
    price_data: {
      currency: "thb",
      product_data: { name: productName },
      unit_amount: Math.round(finalUnitPrice * 100), // to satang
    },
    quantity,
  };
});

    if (paymentFee > 0) {
      line_items.push({
        price_data: {
          currency: "thb",
          product_data: { name: "Payment Fee" },
          unit_amount: Math.round(paymentFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [paymentMethod],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        cartId,
        addressId,
        userId,
        amount: grand_total.toFixed(2),
        payment_method: paymentMethod,
        payment_fee: paymentFee.toFixed(2),
        isDiscount,
        couponId: couponId || "",
        discount_amount: discount_amount.toFixed(2),
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(400).json({ message: error.message || "Checkout failed" });
  }
};

const findAll = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders(req.query.uid);
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const findById = async (req, res) => {
    try {
        const order = await orderModel.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const order = await orderModel.updateOrder(req.params.id, req.body);
        const user = await userModel.getUserById(toObjectId(order.userId));
        await orderUpdateNotify(order.id, user.email, order.status);
        return res.status(200).json(order);
    } catch (error) {
      console.log(error);
        return res.status(400).json({ message: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const order = await orderModel.deleteOrder(req.params.id);
        return res.status(200).json(order);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
