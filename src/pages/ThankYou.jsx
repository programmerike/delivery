import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function ThankYouPage() {
    const location = useLocation();
  const { orderId, pickupCode, deliveryCode } = location.state || {};
  
  return (
    <div className="thank-you" style={{ padding: 20, textAlign: 'center' }}>
      <h1>🎉 Thank You for Your Order!</h1>
      
      <h2>🎉 Delivery Confirmed!</h2>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Pickup Code:</strong> {pickupCode}</p>
      <p><strong>Delivery Code:</strong> {deliveryCode}</p>
      <p>
        We appreciate your trust in SeeYouSoon Courier. Your delivery is being processed and will arrive soon.
      </p>
      
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
        ← Place Another Order
      </Link>
    </div>
  );
}

export default ThankYouPage;
