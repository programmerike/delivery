// /routes/submitDelivery.js
import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const newOrder = new Order({
  senderName,
  pickupAddress,
  deliveryAddress,
  fee,
  distance,
  pickupCode,
  deliveryCode
});

await newOrder.save();
await sendOrderEmail(newOrder); // send email notification


const verificationCodes = {}; // In-memory storage

function generateCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

router.post('/submit', (req, res) => {
  const deliveryData = req.body;

  const pickupCode = generateCode();
  const deliveryCode = generateCode();
  const orderId = crypto.randomUUID();

  verificationCodes[orderId] = {
    pickupCode,
    deliveryCode,
    timestamp: Date.now(),
  };

  // Process other logic (e.g. send to Shipday...)

  res.json({
    orderId,
    pickupCode,
    deliveryCode,
  });
});

export default router;
export { verificationCodes };
