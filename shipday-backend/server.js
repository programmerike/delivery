import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: `https://seeyousoondeliveries.com`,
    methods: ['POST', 'GET'],
    credentials: true
}
));
app.use(express.json());

const {
  GOOGLE_MAPS_API_KEY,
  SHIPDAY_API_KEY,
  SHIPDAY_BUSINESS_ID,
  EMAIL_RECEIVER,
  EMAIL_SENDER,
  EMAIL_PASSWORD,
} = process.env;

console.log('✅ Environment setup complete');

const orders = {}; // Optional: in-memory store

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

// Email sender
async function sendOrderEmail(order) {
  const mailOptions = {
    from: `"SeeYouSoon Deliveries" <${EMAIL_SENDER}>`,
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

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent for order:', order.orderId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

// Submit order route
app.post('/submit-order', async (req, res) => {
  const order = req.body;
  console.log('📦 Received order:', order);

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
    // Send email notification
    await sendOrderEmail(orderData);

    // Prepare Shipday payload
    const shipdayPayload = {
      businessId: SHIPDAY_BUSINESS_ID,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      customerName: order.customerName,
      customerPhoneNumber: order.customerPhone,
      customerEmail: order.customerEmail,
      orderNumber: orderId,
      instructions: `Pickup Code: ${pickupCode}, Delivery Code: ${deliveryCode}`,
    };

    const shipdayResponse = await fetch('https://api.shipday.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SHIPDAY_API_KEY}`,
      },
      body: JSON.stringify(shipdayPayload),
    });

    const responseText = await shipdayResponse.text();
    console.log('Shipday status:', shipdayResponse.status);
    console.log('Shipday response:', responseText);

    if (!shipdayResponse.ok) {
      return res.status(500).json({ error: 'Shipday API error', details: responseText });
    }

    let shipdayData;
    try {
      shipdayData = JSON.parse(responseText);
    } catch (err) {
      console.error('❌ Failed to parse Shipday response:', err.message);
      return res.status(500).json({ error: 'Invalid response from Shipday' });
    }

    res.json({
      success: true,
      orderId,
      pickupCode,
      deliveryCode,
      fee: order.deliveryFee,
      tip: order.tip || 0,
      total: order.total,
      shipday: shipdayData,
    });
  } catch (error) {
    console.error('❌ Error submitting order:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// Root test route
app.get('/', (req, res) => {
  res.send('Hello from SeeYouSoon backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});