// src/pages/ThankYouPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const ThankYouPage = () => {
  const { state } = useLocation();

  if (!state) return <p>Invalid Access</p>;

  return (
    <div className="thank-you-page">
      <h1>Thank You for Your Order!</h1>
      <p><strong>Order ID:</strong> {state.orderId}</p>
      <p><strong>Name:</strong> {state.name}</p>
      <p><strong>Email:</strong> {state.email}</p>
      <p><strong>Pickup Zone:</strong> {state.pickupZone}</p>
      <p><strong>Delivery Zone:</strong> {state.deliveryZone}</p>
      <p><strong>Package:</strong> {state.packageType}</p>
     <p>Total Amount: <strong>GH₵{orderDetails.total}</strong></p>
      <p><strong>Verification Code:</strong> {state.code}</p>
    </div>
  );
};

export default ThankYouPage;
