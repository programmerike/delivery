import React from "react";
import "../styles/thankyou.css";
import { useLocation } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const { orderNumber, fee, tip, total, pickupCode, deliveryCode } =
    location.state || {};

  return (
    <div className="thank-you-container">
      <h1>🎉 Thank You!</h1>
      <p>Your delivery request has been received. We'll handle it with care. 😊</p>

      <div className="summary-card">
        <h2>📦 Delivery Summary</h2>
        <ul>
          <li><strong>Order Number:</strong> {orderNumber || "N/A"}</li>
          <li><strong>Delivery Fee:</strong> ₵{fee || 0}</li>
          <li><strong>Tip:</strong> ₵{tip || 0}</li>
          <li><strong>Total:</strong> ₵{total || 0}</li>
          <li><strong>Pickup Code:</strong> <span className="code">{pickupCode || "N/A"}</span></li>
          <li><strong>Delivery Code:</strong> <span className="code">{deliveryCode || "N/A"}</span></li>
        </ul>
      </div>

      <p className="return-link">
        <a href="/">← Back to Home</a>
      </p>
    </div>
  );
}