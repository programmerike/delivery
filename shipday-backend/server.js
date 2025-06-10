// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import submitDelivery from './submitDelivery.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/submit-order', submitDelivery);

const PORT = process.env.PORT || 5000;

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
    <hr/>
    <p>This order was submitted from SeeYouSoon Courier Booking Form.</p>
  `;

  try {
    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS   // app password
      }
    });

    await transporter.sendMail({
      from: `"SeeYouSoon Courier" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📦 New Delivery Order: ${order.orderNumber}`,
      html: emailBody
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, error: 'Email failed to send' });
  }
});

app.get('/', (req, res) => {
  res.send('SeeYouSoon backend is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});