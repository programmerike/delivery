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
          <p><strong>Order Number:</strong> #{orderNumber}</p>
          <p><strong>Pickup:</strong> {pickupAddress}</p>
          <p><strong>Delivery:</strong> {deliveryAddress}</p>
          <p><strong>Distance:</strong> {distance} km</p>
          <p><strong>Delivery Fee:</strong> GH₵{deliveryFee}</p>
          {tip && <p><strong>Tip:</strong> GH₵{tip}</p>}
          <p className="total-amount"><strong>Total to Pay Rider:</strong> GH₵{total}</p>
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