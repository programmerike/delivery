import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Make sure node-fetch is installed

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// POST /api/create-order
app.post('/api/create-order', async (req, res) => {
  const orderData = req.body;

  try {
    const response = await fetch('https://api.shipday.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.t7ynNW9trM.vmT5J4UCkHkWlpLjZjZB}`, // Use an actual env var name
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

    const contentType = response.headers.get("content-type");
    let responseData;

    if (response.ok && contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from Shipday:', text);
      return res.status(response.status).json({
        message: 'Unexpected Shipday response',
        raw: text,
      });
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (err) {
    console.error('Shipday Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
