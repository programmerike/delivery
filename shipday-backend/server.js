// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/create-order', async (req, res) => {
  const orderData = req.body;

  try {
    const response = await fetch(`https://api.shipday.com/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SHIPDAY_API_KEY}`,
      },
      body: JSON.stringify({
        pickupAddress: orderData.pickupAddress,
        pickupName: orderData.pickupName,
        pickupPhoneNumber: orderData.pickupPhoneNumber,
        deliveryAddress: orderData.deliveryAddress,
        customerName: orderData.customerName,
        phoneNumber: orderData.phoneNumber,
        instructions: orderData.instructions || '',
        items: orderData.items || [],
        orderNumber: orderData.orderNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: data });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Shipday error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
