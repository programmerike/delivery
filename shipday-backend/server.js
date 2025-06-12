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
const GOOGLE_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyfvMpxWU67_jfsFa4x23pUkyGHXWqUV-X5DfN4Mi5wtQbQQLUfSHj5ok6ZuSOc-XX2/exec'; // <-- Replace this

app.post('/submit-order', async (req, res) => {
  const order = req.body;

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
    // 1. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // Gmail App Password
      }
    });

    await transporter.sendMail({
      from: `"SeeYouSoon Courier" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📦 New Delivery Order: ${order.orderNumber}`,
      html: emailBody
    });

    // 2. Log order in Google Sheet
    await fetch(GOOGLE_SHEET_WEBHOOK, {
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
        notes: order.instructions || '',
        pickupCode: order.pickupCode,
        deliveryCode: order.deliveryCode
      })
    });

    res.status(200).json({ success: true, message: 'Order emailed and logged successfully' });

  } catch (err) {
    console.error('Order submission error:', err);
    res.status(500).json({ success: false, error: 'Failed to process order' });
  }
});

app.get('/', (req, res) => {
  res.send('SeeYouSoon backend is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});