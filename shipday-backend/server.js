import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
res.send('SeeYouSoon backend is running!');
});

// Distance and delivery fee calculation
app.post('/api/submit-delivery', async (req, res) => {
try {
const { pickupAddress, deliveryAddress } = req.body;
const apiKey = process.env.AIzaSyAe6wL6YBhQq6hKcZJvIBpe5Lr_wh_1aJQ;const mapsURL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
  pickupAddress
)}&destinations=${encodeURIComponent(deliveryAddress)}&key=${apiKey}`;

const response = await fetch(mapsURL);
const data = await response.json();

if (
  data.rows &&
  data.rows[0].elements &&
  data.rows[0].elements[0].status === 'OK'
) {
  const distanceInKm = data.rows[0].elements[0].distance.value / 1000;

  // Fee calculation based on rules
  let deliveryFee = 0;
  if (distanceInKm <= 3) {
    deliveryFee = 18;
  } else if (distanceInKm <= 4.5) {
    deliveryFee = 22;
  } else {
    const extraKm = Math.ceil((distanceInKm - 4.5) / 2);
    deliveryFee = 22 + extraKm * 4;
  }

  return res.json({
    distance: distanceInKm.toFixed(2),
    deliveryFee,
    message: 'Calculation successful ✅',
  });
} else {
  return res.status(400).json({ error: 'Failed to calculate distance' });
}} catch (error) {
console.error('Error calculating distance:', error.message);
res.status(500).json({ error: 'Server error during calculation' });
}
});

// Order submission with verification codes
app.post('/api/deliveries', (req, res) => {
const formData = req.body;

const orderId = 'S-' + Math.floor(100000 + Math.random() * 900000);
const pickupCode = uuidv4().split('-')[0].toUpperCase();
const deliveryCode = uuidv4().split('-')[0].toUpperCase();

const summary = {
orderId,
pickupCode,
deliveryCode,
...formData
};

console.log('📦 New Delivery Submission:', summary);
res.json(summary);
});


app.listen(PORT, () => {
console.log('✅ Server is listening on port 5000');
});
