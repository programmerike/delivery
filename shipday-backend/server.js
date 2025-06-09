import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const SHIPDAY_API_KEY = process.env.SHIPDAY_API_KEY;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const orders = {}; // In-memory orders store

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'smtp.gmail',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send order email function
async function sendOrderEmail(order) {
  const mailOptions = {
    from: `"SeeYouSoon Deliveris" <${EMAIL_SENDER}>`,
    to: EMAIL_RECEIVER,
    subject: `📬 New Delivery Order #${order.orderId}`,
    html: `
      <h2>🚀 New Order Received</h2>
      <p><strong>Order Number:</strong> ${order.orderId}</p>
      <p><strong>Pickup Address:</strong> ${order.pickupAddress}</p>
      <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
      <p><strong>Customer Name:</strong> ${order.customerName}</p>
      <p><strong>Phone:</strong> ${order.customerPhone}</p>
      <p><strong>Email:</strong> ${order.customerEmail}</p>
      <p><strong>Delivery Fee:</strong> GH₵${order.deliveryFee}</p>
      <p><strong>Tip:</strong> GH₵${order.tip || 0}</p>
      <p><strong>Total:</strong> GH₵${order.total}</p>
      <p><strong>Pickup Code:</strong> ${order.pickupCode}</p>
      <p><strong>Delivery Code:</strong> ${order.deliveryCode}</p>
      <hr />
      <p>You can manually enter this on Shipday if needed.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Submit order endpoint
app.post('/submit-order', async (req, res) => {
  const order = req.body;

  // Generate unique order ID and verification codes
  const orderId = uuidv4();
  const pickupCode = Math.floor(100000 + Math.random() * 900000).toString();
  const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();

  const orderData = {
    ...order,
    orderId,
    pickupCode,
    deliveryCode,
    createdAt: new Date().toISOString(),
  };

  orders[orderId] = orderData;

  try {
    // Send to Shipday
    const response = await fetch('https://api.shipday.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `API-KEY ${SHIPDAY_API_KEY}`,
      },
      body: JSON.stringify({
        restaurant: {
          id: process.env.SHIPDAY_BUSINESS_ID,
        },
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        customerName: order.customerName,
        customerPhoneNumber: order.customerPhone,
        customerEmail: order.customerEmail,
        orderNumber: orderId,
        price: order.total,
        tip: order.tip || 0,
        notes: `Pickup Code: ${pickupCode}, Delivery Code: ${deliveryCode}`,
      }),
    });

    const shipdayResult = await response.json();
    console.log('✅ Shipday response:', shipdayResult);

    // Send email to admin or recipient
    await sendOrderEmail(orderData);

    res.json({
      success: true,
      orderId,
      pickupCode,
      deliveryCode,
      fee: order.deliveryFee,
      tip: order.tip || 0,
      total: order.total,
    });
  } catch (error) {
    console.error('❌ Submit order error:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
