const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payments");
const {validateOrderInputData} = require("../utils/validation");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

paymentRouter.post("/create-order", userAuth, async (req, res) => {
  try {
    validateOrderInputData(req);
    const loggedInUser = req.user;
    console.log("Creating order for user:", loggedInUser._id);
    console.log(req.body)
    var options = {
      amount: req.body.amount, // Amount is in currency subunits.
      currency: req.body.currency,
      receipt: req.body.receipt,
      notes: {
        userId: loggedInUser._id.toString(),
        memberShipType: req.body.memberShipType,
      },
    };
    const order = await razorpayInstance.orders.create(options);
    // console.log(order);

    const orderObj = {
        userId: loggedInUser._id,
        memberShipType: options.notes.memberShipType,
        receipt: options.receipt,
        currency: options.currency,
        amount: options.amount,
        razorpayOrderId: order.id,
        status: order.status,
    }

    const savedOrder = await Payment.create(orderObj);

    const test = await razorpayInstance.orders.fetch(order.id);
    console.log("Fetched order from Razorpay:", test);
    
    res.status(200).json({
      message: "Order created successfully",
      order: {...savedOrder.toJSON(),keyId: process.env.RAZORPAY_KEY_ID, name: loggedInUser.name, email: loggedInUser.email},
    });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .send("Error creating order: " + error.message);
  }
});

paymentRouter.post("/webhook", async (req, res) => {
  try {

    console.log("Received webhook with body:", req.body);
    // const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSignature = req.get('x-razorpay-signature');
    const webhookBody = req.body;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET_KEY;
    /* NODE SDK: https://github.com/razorpay/razorpay-node */


  const isValidWebHook = validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, webhookSecret);
    if (!isValidWebHook) {
      console.error("Invalid webhook signature");
      return res.status(400).send("Invalid webhook signature");
    }

    console.log("Received valid webhook:", webhookBody);
    console.log("webhook is valid: ", isValidWebHook);
    const event = webhookBody.event;
    const payload = webhookBody.payload;
    res.status(200).send("OK");
    // if (event === "payment.captured") {
    //   const paymentEntity = payload.payment.entity;
    //   const razorpayOrderId = paymentEntity.order_id;
    //   const razorpayPaymentId = paymentEntity.id;
    //   const razorpaySignature = webhookSignature;
    //   const paymentRecord = await Payment.findOne({ razorpayOrderId });
    //   if (!paymentRecord) {
    //     console.error("Payment record not found for order ID:", razorpayOrderId);
    //     return res.status(404).send("Payment record not found");
    //   }
    //   paymentRecord.razorpayPaymentId = razorpayPaymentId;
    //   paymentRecord.razorpaySignature = razorpaySignature;
    //   await paymentRecord.save();
    //   console.log("Payment captured and record updated for order ID:", razorpayOrderId);
    // } else {
    //   console.log("Unhandled event type:", event);
    // }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).send("Error processing webhook: " + error.message);
  }
});

module.exports = paymentRouter;
