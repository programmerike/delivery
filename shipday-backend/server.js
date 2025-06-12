// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GOOGLE_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbwoVJlFb2GqYX2htcn_KOXUuAaJWS6VRJ37Y8ysNN2jWswKH2UQbTobx6rbFQvI3Thu7g/exec';

// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,       // your Gmail address
    pass: process.env.EMAIL_PASSWORD        // Gmail App Password (not your actual Gmail password)
  }
});

app.post('/submit-order', async (req, res) => {
  const order = req.body;
  console.log('📥 Received order:', order);

  // Format email content
  const emailBody = `
    <h2>New Delivery Order</h2>
    <p><strong>Pickup Name:</strong> ${order.pickupName}</p>
    <p><strong>Pickup Phone:</strong> ${order.pickupPhoneNumber}</p>
    <p><strong>Pickup Address:</strong> ${order.pickupAddress}</p>
    <p><strong>Customer Name:</strong> ${order.customerName}</p>
    <p><strong>Customer Phone:</strong> ${order.phoneNumber}</p>
    <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
    <p><strong>Instructions:</strong> ${order.instructions || 'None'}</p>
    <p><strong>Distance:</strong> ${order.distance || 'N/A'} km</p>
    <p><strong>Delivery Fee:</strong> GH₵${order.fee}</p>
    <p><strong>Tip:</strong> GH₵${order.tip || 0}</p>
    <p><strong>Total:</strong> GH₵${order.total}</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Pickup Code:</strong> ${order.pickupCode}</p>
    <p><strong>Delivery Code:</strong> ${order.deliveryCode}</p>
    <hr/>
    <p>This order was submitted from SeeYouSoon Courier Booking Form.</p>
  `;

  try {
    // Send email
    const emailResult = await transporter.sendMail({
      from: `SeeYouSoon Courier <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📦 New Delivery Order: ${order.orderNumber}`,
      html: emailBody
    });
    console.log('📧 Email sent:', emailResult.response);

    // Send to Google Sheets webhook
    const webhookResult = await fetch(GOOGLE_SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: order.customerName,
        phone: order.phoneNumber,
        email: order.email,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        distance: order.distance,
        fee: order.fee,
        tip: order.tip,
        total: order.total,
        notes: order.instructions,
        pickupCode: order.pickupCode,
        deliveryCode: order.deliveryCode
      })
    });

    const webhookText = await webhookResult.text();
    console.log('📄 Google Sheet webhook response:', webhookText);

    res.status(200).json({ success: true, message: 'Order processed' });
  } catch (err) {
    console.error('❌ Error in processing:', err.message);
    res.status(500).json({ success: false, error: 'Order failed' });
  }
});

app.get('/', (req, res) => {
  res.send('SeeYouSoon backend is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});