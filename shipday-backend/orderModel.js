import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  senderName: String,
  pickupAddress: String,
  deliveryAddress: String,
  fee: Number,
  distance: Number,
  pickupCode: String,
  deliveryCode: String,
  timestamp: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
