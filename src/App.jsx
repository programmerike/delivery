import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css';
import DeliveryForm from './DeliveryForm';
import ThankYou from './pages/ThankYou'; // Your thank-you page component
import { LoadScript } from '@react-google-maps/api';

function DeliveryForm() {
  const storeAddressRef = useRef(null);
  const deliveryAddressRef = useRef(null);

  const [distance, setDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(22); // base fee GH₵22
  const [tips, setTips] = useState("");
  const [total, setTotal] = useState(22);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (window.google && window.google.maps) {
      new window.google.maps.places.Autocomplete(storeAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' }
      });
      new window.google.maps.places.Autocomplete(deliveryAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' }
      });
    }
  }, []);

  // Calculate distance and delivery fee when addresses change
  useEffect(() => {
    const storeAddress = storeAddressRef.current?.value;
    const deliveryAddress = deliveryAddressRef.current?.value;

    if (storeAddress && deliveryAddress && window.google) {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [storeAddress],
          destinations: [deliveryAddress],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            const distanceInMeters = response.rows[0].elements[0].distance.value;
            const km = distanceInMeters / 1000;
            setDistance(km);

            // Delivery fee logic
            let fee = 20; // base fee
            if (km > 4) {
              fee += 4;
            }
            setDeliveryFee(fee);
          } else {
            setDistance(null);
            setDeliveryFee(20);
          }
        }
      );
    } else {
      setDistance(null);
      setDeliveryFee(20);
    }
  }, [
    storeAddressRef.current?.value,
    deliveryAddressRef.current?.value,
  ]);

  // Update total when delivery fee or tips change
  useEffect(() => {
    const totalAmount = Number(deliveryFee) + Number(tips || 0);
    setTotal(totalAmount);
  }, [deliveryFee, tips]);

  // Form submit handler (optional)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here, e.g. send data to backend or Shipday
    alert(`Order submitted! Total: GH₵${total}`);
  };

  return (
    <div>
      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Who We Are 💡</h2>
          <p>
            <b>
              SeeYouSoon Courier brings joy to your doorstep! We offer super-speedy same-day
              delivery of your favorite food, retail items, and essentials in Accra & Tema 🚴‍♂️.
            </b>
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>✨ Our Delightful Services</h2>
        <div className="service-cards">
          {[
            { label: 'Food Delivery', src: '/images/food-delivery.png' },
            { label: 'Retail Goods', src: '/images/retail-goods.png' },
            { label: 'Medication', src: '/images/medication.png' },
            { label: 'Personal Packages', src: '/images/personal-packages.png' },
          ].map((service, idx) => (
            <div className="card" key={idx}>
              <img src={service.src} alt={service.label} />
              <div>{service.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section" id="booking">
        <div className="order-container">
          <h2>Let's Make a Delivery!</h2>
          <form className="booking-form" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_redirect" value="https://seeyousoondeliveries.com/thank-you" />

            <input type="text" placeholder="🔢 Order Number" required className="bold-input" />

            <fieldset>
              <legend>📍 Pick-up From</legend>
              <input type="text" placeholder="🏪 Store Name" required />
              <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
              <input type="text" placeholder="📍 Store Address" required ref={storeAddressRef} />
              <input type="time" defaultValue="11:10" placeholder="optional" />
              <input type="date" defaultValue="2025-05-30" placeholder="optional" />
            </fieldset>

            <fieldset>
              <legend>🎯 Deliver To</legend>
              <input type="text" placeholder="👤 Customer Name" required />
              <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
              <input type="email" placeholder="✉️ Email Address (optional)" />
              <input type="text" placeholder="📍 Delivery Address" required ref={deliveryAddressRef} />
              <input type="date" defaultValue="2025-05-30" placeholder="optional" />
              <input type="time" defaultValue="11:50" placeholder="optional" />
            </fieldset>

            <fieldset>
              <legend>🧾 Order Details</legend>
              <input type="text" placeholder="🛒 Item Name" />
              <input
                type="number"
                placeholder="🚚 Delivery Fees (₵)"
                value={deliveryFee}
                readOnly
              />
              <input
                type="number"
                placeholder="🎁 Tips (₵)"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                min="0"
              />
              <input type="number" placeholder="💵 Total (₵)" value={total} readOnly />
            </fieldset>

            <textarea placeholder="🗒️ Any fun delivery instructions?" rows={3}></textarea>

            <select required>
              <option value="">💳 Choose a Payment Method</option>
              <option value="cash">💵 Cash on Delivery</option>
              <option value="momo">📱 Mobile Money</option>
              
            </select>

            <p>📏 Distance: {distance ? `${distance.toFixed(2)} km` : 'N/A'}</p>
            <p>🚚 Delivery Fee: GH₵{deliveryFee}</p>
            <p>💵 Total: GH₵{total}</p>

            <button type="submit">🎉 Submit Order</button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>📬 Contact Us</h2>
        <p>
          Email:{' '}
          <a href="mailto:seeyousoon.delivery@gmail.com">seeyousoon.deliveries@gmail.com</a>
        </p>
        <p>
          Phone: <a href="tel:+233533846238">+233 53 384 6238</a>
          <br />
          <a href="tel:+233531448173">+233 53 144 8173</a>
        </p>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>🗺️ We Deliver In:</h2>
        <iframe
          title="Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126917.96664707348!2d-0.26272953441869345!3d5.614818856901056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfe2a5490bfc5bb9%3A0x5f9e7f7e8e8e8e8e!2sAccra!5e0!3m2!1sen!2sgh!4v1717079468473"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

function App() {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAe6wL6YBhQq6hKcZJvIBpe5Lr_wh_1aJQ
"
      libraries={['places']}
    >
    <Router>
      <Routes>
        <Route path="/" element={<DeliveryForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
    </LoadScript>
  );
}

export default App;
