import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET': 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET': 'NOT SET');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail address
    pass: process.env.EMAIL_PASS        // app-specific password
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('SeeYouSoon backend is running');
});

// Delivery fee calculator (you already had this)
app.post('/calculate-fee', async (req, res) => {
  const { pickupAddress, deliveryAddress } = req.body;

  try {
    // Fake distance logic (replace with real Google Maps call in production)
    const fakeDistance = 5.6; // kilometers

    let fee = 0;
    if (fakeDistance <= 3) fee = 18;
    else if (fakeDistance <= 4.5) fee = 22;
    else fee = 22 + Math.ceil((fakeDistance - 4.5) / 2) * 4;

    res.json({ distance: fakeDistance, fee });
  } catch (err) {
    console.error('Error calculating fee:', err);
    res.status(500).json({ error: 'Failed to calculate delivery fee' });
  }
});

// Main form submission route
app.post('/submit-order', async (req, res) => {
    console.log("🔔 Incoming Order:", req.body);
  const order = req.body;

  try {
    // Send confirmation email if customer provided an email
    if (order.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.email,
        subject: 'Your SeeYouSoon Delivery Confirmation',
        html: `
          <h2>Delivery Confirmation</h2>
          <p>Hi ${order.customerName},</p>
          <p>Your delivery from <strong>${order.storeName}</strong> to <strong>${order.deliveryAddress}</strong> has been confirmed.</p>
          <ul>
            <li><strong>Order Number:</strong> ${order.orderNumber}</li>
            <li><strong>Pickup:</strong> ${order.pickupAddress} on ${order.pickupDate} at ${order.pickupTime}</li>
            <li><strong>Delivery:</strong> ${order.deliveryDate} at ${order.deliveryTime}</li>
            <li><strong>Total:</strong> GH₵${order.total}</li>
          </ul>
          <p>Thanks for choosing SeeYouSoon!</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${order.email}`);
    } else {
      console.log("ℹ️ No email provided, skipping confirmation email.");
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: 'Order received, but email failed to send' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});