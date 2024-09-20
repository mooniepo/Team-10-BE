import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../Database/models/cart.js";
import { productModel } from "../../../Database/models/product.js";
import { orderModel } from "../../../Database/models/order.js";

import Stripe from "stripe";
import { userModel } from "../../../Database/models/user.js";
const stripe = new Stripe(
  "sk_test_51NV8e0HVbfRYk4SfG3Ul84cabreiXkPbW1xMugwqvU9is2Z2ICEafTtG6NHLIUdFVIjkiRHYmAPKxCLsCpoU2NnN00LVpHcixz"
);

const createCashOrder = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);

  // console.log(cart);
  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  console.log(cart.cartItem);
  const order = new orderModel({
    userId: req.user._id,
    cartItem: cart.cartItem,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  await order.save();

  // console.log(order);
  if (order) {
    let options = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await productModel.bulkWrite(options);

    await cartModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ message: "success", order });
  } else {
    next(new AppError("Error in cart ID", 404));
  }
});

const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  console.log(req.user._id);

  let order = await orderModel
    .findOne({ userId: req.user._id })
    .populate("cartItems.productId");

  res.status(200).json({ message: "success", order });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.findOne({}).populate("cartItems.productId");

  res.status(200).json({ message: "success", orders });
});

const createCheckOutSession = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);
  if(!cart) return next(new AppError("Cart was not found",404))

  console.log(cart);

  // console.log(cart);
  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  let sessions = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://github.com/AbdeIkader",
    cancel_url: "https://www.linkedin.com/in/abdelrahman-abdelkader-259781215/",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });

  res.json({ message: "success", sessions });
});

const createOnlineOrder = catchAsyncError(async (request, response) => {
  const sig = request.headers["stripe-signature"].toString();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      "whsec_fcatGuOKvXYUQoz5NWSwH9vaqdWXIWsI"
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type == "checkout.session.completed") {
    // const checkoutSessionCompleted = event.data.object;
    card(event.data.object,response)


  } else {
    console.log(`Unhandled event type ${event.type}`);
  }
});

//https://ecommerce-backend-codv.onrender.com/api/v1/orders/checkOut/6536c48750fab46f309bb950


async function card (e,res){
  let cart = await cartModel.findById(e.client_reference_id);

  if(!cart) return next(new AppError("Cart was not found",404))

  let user = await userModel.findOne({email:e.customer_email})
  const order = new orderModel({
    userId: user._id,
    cartItem: cart.cartItem,
    totalOrderPrice : e.amount_total/100,
    shippingAddress: e.metadata.shippingAddress,
    paymentMethod:"card",
    isPaid:true,
    paidAt:Date.now()
  });

  await order.save();

  // console.log(order);
  if (order) {
    let options = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await productModel.bulkWrite(options);

    await cartModel.findOneAndDelete({userId: user._id});

    return res.status(201).json({ message: "success", order });
  } else {
    next(new AppError("Error in cart ID", 404));
  }
}

const createOrder = catchAsyncError(async (req, res, next) => {
  // Get the productId from the URL parameter
  const productId = req.params.id;

  // Find the product in the database to ensure it exists
  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Create the cart item with the productId, quantity, price, etc.
  const cartItem = {
    productId: productId,
    quantity: req.body.quantity || 1, // default to 1 if not provided
    price: product.price, // assuming price comes from the product data
    totalProductDiscount: req.body.totalProductDiscount || 0,
  };

  // Create the order
  const newOrder = new orderModel({
    userId: req.user._id, // assuming user is authenticated and their ID is in req.user
    cartItems: [cartItem],
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || "cash", // default to cash if not provided
    isPaid: req.body.isPaid || false,
    isDelivered: req.body.isDelivered || false,
    paidAt: req.body.isPaid ? Date.now() : null, // Set paid date if the order is paid
    deliveredAt: req.body.isDelivered ? Date.now() : null, // Set delivery date if delivered
  });

  // Save the order to the database
  await newOrder.save();

  // Return a success response
  res.status(201).json({ message: "Order created successfully", newOrder });
});

const updateOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log({ user: req.user._id });
  const updateOrder = await orderModel.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  console.log(updateOrder);

  updateOrder && res.status(201).json({ message: "success", updateOrder });

  !updateReview &&
    next(
      new AppError(
        "Order was not found or you're not authorized to review this project",
        404
      )
    );
});

const getSpecificOrderByOrderId = catchAsyncError(async (req, res, next) => {
  const { id: orderId } = req.params; // Get order ID from URL parameters

  // Find the order where userId matches req.user._id and the orderId matches the URL param
  let order = await orderModel.findOne({
    userId: req.user._id, // Matches the current authenticated user
    _id: orderId,         // Matches the specific order ID from the URL
  }).populate("cartItems.productId");  // Populate product details for cartItems

  if (!order) {
    return next(new AppError("Order not found for this user", 404));
  }

  res.status(200).json({ message: "success", order });
});


export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckOutSession,
  getSpecificOrderByOrderId,
  createOnlineOrder,
  createOrder,
  updateOrder
};
