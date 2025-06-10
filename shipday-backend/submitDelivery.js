// routes/submitDelivery.js
import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const verificationCodes = {}; // In-memory for now

function generateCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function sendOrderEmail(order) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SEEYOUSOON_EMAIL,
      pass: process.env.SEEYOUSOON_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"SeeYouSoon Courier" <${process.env.SEEYOUSOON_EMAIL}>`,
    to: process.env.SEEYOUSOON_EMAIL, // send to your admin inbox
    subject: `📦 New Delivery Order from ${order.senderName}`,
    text: `
New Delivery Order

Sender: ${order.senderName}
Pickup Address: ${order.pickupAddress}
Delivery Address: ${order.deliveryAddress}
Distance: ${order.distance} km
Fee: GH₵${order.fee}

Pickup Verification Code: ${order.pickupCode}
Delivery Verification Code: ${order.deliveryCode}
Order ID: ${order.orderId}
    `,
  };

  return transporter.sendMail(mailOptions);
}

router.post('/submit', async (req, res) => {
  try {
    const deliveryData = req.body;

    const pickupCode = generateCode();
    const deliveryCode = generateCode();
    const orderId = crypto.randomUUID();

    // Store verification codes in memory
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

    // Send email
    await sendOrderEmail(order);

    res.json({
      success: true,
      orderId,
      pickupCode,
      deliveryCode,
    });
  } catch (err) {
    console.error('Error processing order:', err);
    res.status(500).json({ success: false, error: 'Failed to submit order' });
  }
});

export default router;
export { verificationCodes };