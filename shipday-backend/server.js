import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

// Logging to confirm .env config
console.log("EMAIL_USER:", process.env.ADMIN_EMAIL ? "SET" : "NOT SET");
console.log("EMAIL_PASS:", process.env.ADMIN_EMAIL_PASSWORD ? "SET" : "NOT SET");
console.log("NOTIFY_EMAIL:", process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

// Email sending function
const sendOrderEmail = async (order) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL,
    subject: `🚚 New SeeYouSoon Order #${order.orderNumber}`,
    html: `
      <h2>New Delivery Order</h2>
      <p><strong>📦 Item:</strong> ${order.itemName}</p>
      <p><strong>📍 Pickup From:</strong> ${order.storeName} (${order.pickupPhone})<br/>${order.pickupAddress}<br/>${order.pickupDate} at ${order.pickupTime}</p>
      <p><strong>🎯 Deliver To:</strong> ${order.customerName} (${order.deliveryPhone})<br/>${order.deliveryAddress}<br/>${order.deliveryDate} at ${order.deliveryTime}</p>
      <p><strong>📝 Instructions:</strong> ${order.instructions || 'None'}</p>
      <p><strong>💳 Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>💰 Fees:</strong> GH₵${order.deliveryFees} + GH₵${order.tips} Tip = <strong>GH₵${order.total}</strong></p>
      ${order.email ? <p><strong>✉️ Customer Email:</strong> ${order.email}</p> : ''}
    `
  };

  await transporter.sendMail(mailOptions);
};

// POST /submit-order route
app.post('/submit-order', async (req, res) => {
  const order = req.body;

  try {
    // send the email to you
    await sendOrderEmail(order);

    res.status(200).json({ success: true, message: 'Order received and email sent.' });
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Order received, but email failed.' });
  }
});

// Sample endpoint
app.get('/', (req, res) => {
  res.send('Your service is live ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});