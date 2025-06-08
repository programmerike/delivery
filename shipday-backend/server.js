import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/submit-order', async (req, res) => {
  const order = req.body;

  const mailOptions = {
    from: `"SeeYouSoon Courier" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `📦 New Delivery Order: ${order.orderNumber || 'N/A'}`,
    html: `
      <h2>🚚 New Delivery Order Received</h2>
      <p><strong>🛒 Item:</strong> ${order.itemName}</p>
      <p><strong>📍 Pickup:</strong> ${order.pickupAddress} (${order.storeName})</p>
      <p><strong>📞 Pickup Phone:</strong> ${order.pickupPhone}</p>
      <p><strong>📦 Delivery:</strong> ${order.deliveryAddress} (${order.customerName})</p>
      <p><strong>📞 Delivery Phone:</strong> ${order.deliveryPhone}</p>
      ${order.email ? <p><strong>✉️ Customer Email:</strong> ${order.email}</p> : ''}
      <p><strong>📅 Date:</strong> ${order.deliveryDate} at ${order.deliveryTime}</p>
      <p><strong>💰 Fee:</strong> GH₵${order.deliveryFees}</p>
      <p><strong>🎁 Tip:</strong> GH₵${order.tips}</p>
      <p><strong>💵 Total:</strong> GH₵${order.total}</p>
      ${order.instructions ? <p><strong>📝 Instructions:</strong> ${order.instructions}</p> : ''}
      <p><strong>💳 Payment Method:</strong> ${order.paymentMethod || 'Not specified'}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📨 Email sent successfully.");
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    res.status(500).json({ success: false, error: "Email failed to send." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});