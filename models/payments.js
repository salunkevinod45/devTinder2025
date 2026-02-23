const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    memberShipType: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    status:{
        type: String,
    }
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;