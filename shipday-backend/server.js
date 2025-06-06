// server.js
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
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER; // your email
const EMAIL_SENDER = process.env.EMAIL_SENDER;     // send from here via nodemailer (optional)

const orders = {}; // In-memory order store

// 📧 Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD  // App password from Gmail
  }
});

// 📧 Email sender
const sendOrderEmail = async (order) => {
  const mailOptions = {
    from: `"SeeYouSoon Courier" <${process.env.EMAIL_USERNAME}>`,
    to: EMAIL_RECEIVER || 'your.email@example.com',
    subject: `New Delivery Order from ${order.senderName || 'Unknown Sender'}`,
    html: `
      <h2>New Order</h2>
      <p><strong>Pickup:</strong> ${order.pickupAddress}</p>
      <p><strong>Delivery:</strong> ${order.deliveryAddress}</p>
      <p><strong>Fee:</strong> GH₵${order.fee}</p>
      <p><strong>Pickup Code:</strong> ${order.pickupCode}</p>
      <p><strong>Delivery Code:</strong> ${order.deliveryCode}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// 🚚 Calculate delivery fee
app.post("/calculate-fee", async (req, res) => {
  const { pickupAddress, deliveryAddress } = req.body;
  console.log("Received addresses:", pickupAddress, deliveryAddress);

  try {
    const formattedPickup = `${pickupAddress}, Ghana`;
    const formattedDelivery = `${deliveryAddress}, Ghana`;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
        formattedPickup
      )}&destinations=${encodeURIComponent(
        formattedDelivery
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    console.log("Google API Response:", data);

    if (
      data.status === "OK" &&
      data.rows[0].elements[0].status === "OK"
    ) {
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInKm = distanceInMeters / 1000;

      let fee;
      if (distanceInKm <= 3) {
        fee = 18;
      } else if (distanceInKm <= 4.5) {
        fee = 22;
      } else {
        fee = 22 + Math.ceil((distanceInKm - 4.5) / 2) * 4;
      }

      return res.json({ fee, distance: distanceInKm.toFixed(2) });
    } else {
      return res.status(400).json({ error: "Unable to calculate distance." });
    }
  } catch (error) {
    console.error("Fee calculation error:", error);
    res.status(500).json({ error: "Internal error." });
  }
});

// 🚀 Submit order to Shipday + Save locally
app.post("/submit-order", async (req, res) => {
  const order = req.body;

  const orderId = uuidv4();
  const pickupCode = Math.floor(100000 + Math.random() * 900000).toString();
  const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();

  const orderData = {
    ...order,
    orderId,
    pickupCode,
    deliveryCode,
    createdAt: new Date().toISOString()
  };

  // Save in-memory
  orders[orderId] = orderData;

  // 🌐 Submit to Shipday
  try {
    const shipdayResponse = await fetch('https://api.shipday.com/v1/dispatch/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': SHIPDAY_API_KEY
      },
      body: JSON.stringify({
        restaurant: {
          name: "SeeYouSoon Courier",
          address: order.pickupAddress,
          phoneNumber: order.pickupPhone
        },
        customer: {
          name: order.deliveryName,
          address: order.deliveryAddress,
          phoneNumber: order.deliveryPhone,
          email: order.deliveryEmail
        },
        orderNumber: orderId,
        deliveryFee: order.fee,
        tip: order.tip || 0,
        items: [
          { name: order.description || "Delivery Item", quantity: 1 }
        ],
        instructions: `Pickup Code: ${pickupCode}, Delivery Code: ${deliveryCode}`
      })
    });

    const shipdayResult = await shipdayResponse.json();
    console.log("Shipday Response:", shipdayResult);

    // ✉️ Send email notification
    await sendOrderEmail(orderData);

    res.json({
      success: true,
      orderId,
      fee: order.fee,
      pickupCode,
      deliveryCode
    });
  } catch (error) {
    console.error("Shipday error:", error);
    res.status(500).json({ error: "Failed to submit order to Shipday" });
  }
});

// 🔐 Verify one-time codes
app.post("/verify-code", (req, res) => {
  const { orderId, code } = req.body;
  const order = orders[orderId];

  if (!order) {
    return res.status(404).json({ valid: false, message: "Order not found" });
  }

  if (code === order.pickupCode || code === order.deliveryCode) {
    // Invalidate the code to prevent reuse
    if (code === order.pickupCode) delete order.pickupCode;
    if (code === order.deliveryCode) delete order.deliveryCode;
    return res.json({ valid: true });
  }

  return res.json({ valid: false, message: "Invalid code" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
