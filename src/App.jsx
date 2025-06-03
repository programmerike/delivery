import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ThankYou from './pages/ThankYou';
import './app.css';
import calculateDistanceAndFee from './utils/calculateDistanceAndFee';

function MainApp() {
  const storeAddressRef = useRef(null);
  const deliveryAddressRef = useRef(null);
  const [storeLocation, setStoreLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [fee, setFee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google && window.google.maps) {
      const autocompleteStore = new window.google.maps.places.Autocomplete(storeAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' }
      });

      autocompleteStore.addListener('place_changed', () => {
        const place = autocompleteStore.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setStoreLocation(location);
        }
      });

      const autocompleteDelivery = new window.google.maps.places.Autocomplete(deliveryAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' }
      });

      autocompleteDelivery.addListener('place_changed', () => {
        const place = autocompleteDelivery.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setDeliveryLocation(location);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (storeLocation && deliveryLocation) {
      const { distance, fee } = calculateDistanceAndFee(storeLocation, deliveryLocation);
      setDistance(distance);
      setFee(fee);
    }
  }, [storeLocation, deliveryLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add distance and fee
    data.distance = distance;
    data.fee = fee;

    const res = await fetch('https://your-backend-url.com/api/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      navigate('/thank-you');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-content fade-in">
          <h1>🚀 SeeYouSoon Deliveries</h1>
          <p>Quick And Reliable Same-day delivery across Accra & Tema.</p>
          <a href="#booking" className="hero-button">Book a Delivery</a>
        </div>
      </section>

      {/* Booking */}
      <section className="booking-section" id="booking">
        <div className="order-container">
          <h2>Let's Make a Delivery!</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>📍 Pick-up From</legend>
              <input type="text" name="storeName" placeholder="🏪 Store Name" required />
              <input type="tel" name="storePhone" placeholder="📞 +233 (000) 000-00-00" required />
              <input type="text" name="storeAddress" placeholder="📍 Store Address" required ref={storeAddressRef} />
              {storeLocation && (
                <iframe
                  title="Pickup Map"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0, marginTop: '0.5rem' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.72273031101!2d-0.26213092137685406!3d5.591373807227595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra!5e0!3m2!1sen!2sgh!4v1748930121025!5m2!1sen!2sgh" 
                  />
              )}
              <input type="time" name="pickupTime" defaultValue="11:10" /><input type="date" name="pickupDate" defaultValue="2025-05-30" />
            </fieldset>

            <fieldset>
              <legend>🎯 Deliver To</legend>
              <input type="text" name="customerName" placeholder="👤 Customer Name" required />
              <input type="tel" name="customerPhone" placeholder="📞 +233 (000) 000-00-00" required />
              <input type="email" name="customerEmail" placeholder="✉️ Email Address optional" />
              <input type="text" name="deliveryAddress" placeholder="📍 Delivery Address" required ref={deliveryAddressRef} />
              {deliveryLocation && (
                <iframe
                  title="Delivery Map"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0, marginTop: '0.5rem' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.72273031101!2d-0.26213092137685406!3d5.591373807227595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra!5e0!3m2!1sen!2sgh!4v1748930121025!5m2!1sen!2sgh" 
                  allowFullScreen
                />
              )}
              <input type="date" name="deliveryDate" defaultValue="2025-05-30" />
              <input type="time" name="deliveryTime" defaultValue="11:50" />
            </fieldset>

            <fieldset>
              <legend>🧾 Order Details</legend>
              <input type="text" name="itemName" placeholder="🛒 Item Name" />
              <input type="number" name="tip" placeholder="🎁 Tips (₵)" />
              <input type="number" name="total" placeholder="💵 Total (₵)" value={fee || ''} readOnly />
            </fieldset>

            <textarea name="instructions" placeholder="🗒 Any fun delivery instructions?" rows={3}></textarea>

            <select name="paymentMethod" required>
              <option value="">💳 Choose a Payment Method</option>
              <option value="cash">💵 Cash on Delivery</option>
              <option value="momo">📱 Mobile Money</option>
              <option value="card">💳 Credit/Debit Card</option>
            </select>

            <button type="submit">🎉 Submit Order</button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>📬 Contact Us</h2>
        <p>Email: <a href="mailto:seeyousoon.deliveries@gmail.com">seeyousoon.deliveries@gmail.com</a></p>
        <p>
          Phone: <a href="tel:+233533846238">+233 53 384 6238</a><br />
          <a href="tel:+233531448173">+233 53 144 8173</a>
        </p>
      </section>

      {/* Coverage Map */}
      <section className="map-section">
        <h2>🗺 We Deliver In:</h2>
        <iframe
          title="Coverage Map"
         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253833.51858247174!2d-0.35636017814489686!3d5.614818856901063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfe2a5490bfc5bb9%3A0x5f9e7f7e8e8e8e8e!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1717443012345!5m2!1sen!2sgh"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}