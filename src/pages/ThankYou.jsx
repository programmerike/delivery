import React from 'react';
import { Link } from 'react-router-dom';

function ThankYouPage() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>🎉 Thank You for Your Order!</h1>
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
