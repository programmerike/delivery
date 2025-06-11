// routes/submitDelivery.js
import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER;

const router = express.Router();
const verificationCodes = {}; // In-memory temporary storage

// Generate random 6-char hex codes
function generateCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// Send email with order details
function sendOrderEmail(order) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"SeeYouSoon Courier" <${process.env.EMAIL_SENDER}>`,
    to: process.env.EMAIL_SENDER,
    subject: `📦 New Delivery Order from ${order.senderName}`,
    text: `
✅ NEW DELIVERY ORDER

Sender: ${order.senderName}
Pickup Address: ${order.pickupAddress}
Delivery Address: ${order.deliveryAddress}
Distance: ${order.distance} km
Fee: GH₵${order.fee}

Pickup Verification Code: ${order.pickupCode}
Delivery Verification Code: ${order.deliveryCode}
Order ID: ${order.orderId}
    `
  };

  return transporter.sendMail(mailOptions);
}

// Handle POST request
router.post('/submit', async (req, res) => {
  try {
    const deliveryData = req.body;

    const pickupCode = generateCode();
    const deliveryCode = generateCode();
    const orderId = crypto.randomUUID();

    // Store verification codes temporarily
    verificationCodes[orderId] = {
      pickupCode,
      deliveryCode,
      timestamp: Date.now(),
    };

    // Build order object
    const order = {
      orderId,
      senderName: deliveryData.senderName,
      pickupAddress: deliveryData.pickupAddress,
      deliveryAddress: deliveryData.deliveryAddress,
      distance: deliveryData.distance,
      fee: deliveryData.fee,
      pickupCode,
      deliveryCode,
    };

    // Send the email
    await sendOrderEmail(order);
    
    // Respond to frontend
    res.json({
      success: true,
      orderId,
      pickupCode,
      deliveryCode,
    });
  } catch (err) {
    console.error('❌ Email/Order Error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit order.' });
  }
});

export default router;
export { verificationCodes };