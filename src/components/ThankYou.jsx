// src/pages/ThankYouPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/thankyou.css";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location ;
  const {
    orderNumber,
    pickupAddress,
    deliveryAddress,
    distance,
    deliveryFee,
    tip,
    total,
    pickupCode,
    deliveryCode,
  } = state || {};

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <h1 className="main-message">SeeYouSoon 🏍️ᯓ</h1>
        <p className="sub-message">Your delivery has been booked successfully!</p>

        <div className="details-box">
            <p><strong>Order Number:</strong> {orderData.orderNumber}</p>
        <p><strong>Store Name:</strong> {orderData.storeName}</p>
        <p><strong>Pickup Phone:</strong> {orderData.pickupPhone}</p>
        <p><strong>Pickup Address:</strong> {orderData.pickupAddress}</p>
        <p><strong>Pickup Time:</strong> {orderData.pickupTime}</p>
        <p><strong>Pickup Date:</strong> {orderData.pickupDate}</p>
        <p><strong>Customer Name:</strong> {orderData.customerName}</p>
        <p><strong>Delivery Phone:</strong> {orderData.deliveryPhone}</p>
        <p><strong>Delivery Address:</strong> {orderData.deliveryAddress}</p>
        <p><strong>Delivery Time:</strong> {orderData.deliveryTime}</p>
        <p><strong>Delivery Date:</strong> {orderData.deliveryDate}</p>
        <p><strong>Item Name:</strong> {orderData.itemName}</p>
        <p><strong>Delivery Fee:</strong> GH₵{orderData.deliveryFees}</p>
        <p><strong>Tips:</strong> GH₵{orderData.tips}</p>
        <p><strong>Total:</strong> GH₵{orderData.total}</p>
        <p><strong>Instructions:</strong> {orderData.instructions || 'None'}</p>
        <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
        <p><strong>Email:</strong> {orderData.email || 'N/A'}</p>
        </div>

        <div className="code-section">
          <p className="code-label">📦 One-Time Pickup Code:</p>
          <div className="code">{pickupCode}</div>

          <p className="code-label">📬 One-Time Delivery Code:</p>
          <div className="code">{deliveryCode}</div>
        </div>

        <p className="footer-message">Thank you for choosing SeeYouSoon! 🧡</p>
        <button className="back-home-btn" onClick={() => navigate('/')}>
        ⬅ Back to Home
      </button>
      </div>
    </div>
  );
};

export default ThankYouPage;