// /routes/verify.js
import express from 'express';
import { verificationCodes } from './submitDelivery.js';

const router = express.Router();

router.post('/verify', (req, res) => {
  const { code } = req.body;

  let foundKey;
  for (const [orderId, data] of Object.entries(verificationCodes)) {
    if (data.pickupCode === code || data.deliveryCode === code) {
      foundKey = orderId;
      break;
    }
  }

  if (foundKey) {
    delete verificationCodes[foundKey]; // Invalidate after use
    res.json({ message: '✅ Code verified successfully!' });
  } else {
    res.status(400).json({ message: '❌ Invalid or already used code.' });
  }
});

export default router;
