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
  origin: 'https://seeyousoondeliveries.com',
  methods: ['POST', 'GET'],
  credentials: true
}));
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

const orders = {}; // In-memory storage for orders

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

// Email sender function
async function sendOrderEmail(order) {
    
  const mailOptions = {
    from: `"SeeYouSoon Deliveries" <${EMAIL_SENDER}>`,
    to: order.customerEmail || EMAIL_RECEIVER,
    subject: `📬 Order Confirmation #${order.orderId}`,
    html: `
      <h2>🚀 New Order Received</h2>
      <p><strong>Order Number:</strong> ${order.orderId}</p>
      <p><strong>Pickup Address:</strong> ${order.pickupAddress}</p>
      <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
      <p><strong>Customer Name:</strong> ${order.customerName}</p>
      <p><strong>Phone:</strong> ${order.customerPhone}</p>
      <p><strong>Email:</strong> ${order.customerEmail || 'Not provided'}</p>
      <p><strong>Delivery Fee:</strong> GH₵${order.deliveryFee}</p>
      <p><strong>Tip:</strong> GH₵${order.tip || 0}</p>
      <p><strong>Total:</strong> GH₵${order.total}</p>
      <p><strong>Pickup Code:</strong> ${order.pickupCode}</p>
      <p><strong>Delivery Code:</strong> ${order.deliveryCode}</p>
      <hr />
      <p>You can manually enter this on Shipday if needed.</p>
    `,
  };
  console.log('📧 Attempting to send email to:', EMAIL_RECEIVER);
console.log('💡 Mail content:', mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent for order:', order.orderId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

// Delivery fee calculation function
async function calculateDeliveryFee(pickupAddress, deliveryAddress) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickupAddress)}&destinations=${encodeURIComponent(deliveryAddress)}&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log('Distance Matrix API response:', JSON.stringify(data, null, 2));

  if (
    !data.rows ||
    !data.rows[0] ||
    !data.rows[0].elements ||
    !data.rows[0].elements[0] ||
    data.rows[0].elements[0].status !== 'OK'
  ) {
    throw new Error('Invalid response from Google Distance Matrix API');
  }

  const distanceMeters = data.rows[0].elements[0].distance.value;
  const distanceKm = distanceMeters / 1000;

  // Fee calculation logic
  if (distanceKm <= 3) return 18;
  if (distanceKm <= 4.5) return 22;
  const extraDistance = distanceKm - 4.5;
  const extraFee = Math.ceil(extraDistance / 2) * 4;
  return 22 + extraFee;


  return { distance: distanceKm.toFixed(2), fee };
}

// Main route to handle order submission
app.post('/submit-order', async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      customerName,
      deliveryPhone,
      email,
      tips,
      itemName,
      instructions,
      paymentMethod
    } = req.body;

    // 1. Calculate distance and fee
    const { distance, fee } = await calculateDeliveryFee(pickupAddress, deliveryAddress);

    // 2. Generate codes and ID
    const orderId = uuidv4();
    const pickupCode = Math.floor(100000 + Math.random() * 900000).toString();
    const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tip = Number(tips || 0);
    const total = fee + tip;

    const order = {
      orderId,
      pickupAddress,
      deliveryAddress,
      customerName,
      customerPhone: deliveryPhone,
      customerEmail: email,
      deliveryFee: fee,
      tip,
      total,
      itemName,
      paymentMethod,
      instructions,
      pickupCode,
      deliveryCode,
      distance,
      createdAt: new Date().toISOString()
    };

    // 3.Store in-memory (or database later)
    orders[orderId] = order;

    // 4. Send email
    await sendOrderEmail(order);
    

    // 5. Send to Shipday
    const shipdayPayload = {
      businessId: SHIPDAY_BUSINESS_ID,
      pickupAddress,
      deliveryAddress,
      customerName,
      customerPhoneNumber: deliveryPhone,
      customerEmail: email,
      orderNumber: orderId,
      instructions: `Pickup Code: ${pickupCode}, Delivery Code: ${deliveryCode}`
    };

    const shipdayRes = await fetch('https://api.shipday.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SHIPDAY_API_KEY}`,
      },
      body: JSON.stringify(shipdayPayload),
    });

    const shipdayResponseText = await shipdayRes.text();
    let shipdayResponse;
    try {
      shipdayResponse = JSON.parse(shipdayResponseText);
    } catch (err) {
      console.warn('⚠️ Could not parse Shipday response as JSON');
    }

    // 6. Respond to frontend
    res.json({
      success: true,
      orderId,
      pickupCode,
      deliveryCode,
      distance,
      fee,
      tip,
      total,
      shipday: shipdayResponse || shipdayResponseText
    });
  } catch (err) {
    console.error('❌ Order submission error:', err);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello from SeeYouSoon backend!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});