import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css';
import ThankYou from './pages/ThankYou';

function App() {
  const storeAddressRef = useRef(null);
  const deliveryAddressRef = useRef(null);

  const [storeLocation, setStoreLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      const autocompleteStore = new window.google.maps.places.Autocomplete(storeAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' }
      });

      autocompleteStore.addListener('place_changed', () => {
        const place = autocompleteStore.getPlace();
        if (place.geometry) {
          setStoreLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });

      const autocompleteDelivery = new window.google.maps.places.Autocomplete(deliveryAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' }
      });

      autocompleteDelivery.addListener('place_changed', () => {
        const place = autocompleteDelivery.getPlace();
        if (place.geometry) {
          setDeliveryLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content fade-in">
          <h1>🚀SeeYouSoon Deliveries</h1>
          <p> Quick And Reliable Same-day delivery across Accra & Tema.</p>
          <a href="#booking" className="hero-button">
            Book a Delivery
          </a>
        </div>
      </section>

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
          <form className="booking-form" action="https://formsubmit.co/seeyousoon.deliveries@gmail.com" method="POST">
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_redirect" value="https://seeyousoondeliveries.com/thank-you" />

            <input type="text" placeholder="🔢 Order Number" required className="bold-input" />

            <fieldset>
              <legend>📍 Pick-up From</legend>
              <input type="text" placeholder="🏪 Store Name" required />
              <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
              <input type="text" placeholder="📍 Store Address" required ref={storeAddressRef} />
              {storeLocation && (
                <iframe
                  title="Pickup Map"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0, marginTop: '0.5rem' }}
                  src={`https://maps.google.com/maps?q=${storeLocation.lat},${storeLocation.lng}&z=15&output=embed`}
                  allowFullScreen
                />
              )}
              <input type="time" defaultValue="11:10" />
              <input type="date" defaultValue="2025-05-30" />
            </fieldset>

            <fieldset>
              <legend>🎯 Deliver To</legend>
              <input type="text" placeholder="👤 Customer Name" required />
              <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
              <input type="email" placeholder="✉️ Email Address optional" />
              <input type="text" placeholder="📍 Delivery Address" required ref={deliveryAddressRef} />
              {deliveryLocation && (
                <iframe
                  title="Delivery Map"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0, marginTop: '0.5rem' }}
                  src={`https://maps.google.com/maps?q=${deliveryLocation.lat},${deliveryLocation.lng}&z=15&output=embed`}
                  allowFullScreen
                />
              )}
              <input type="date" defaultValue="2025-05-30" />
              <input type="time" defaultValue="11:50" />
            </fieldset>

            <fieldset>
              <legend>🧾 Order Details</legend>
              <input type="text" placeholder="🛒 Item Name" />
              <input type="number" placeholder="🚚 Delivery Fees (₵)" />
              <input type="number" placeholder="🎁 Tips (₵)" />
              <input type="number" placeholder="💵 Total (₵)" />
            </fieldset>

            <textarea placeholder="🗒️ Any fun delivery instructions?" rows={3}></textarea>

            <select required>
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
        <p>
          Email: <a href="mailto:seeyousoon.delivery@gmail.com">seeyousoon.deliveries@gmail.com</a>
        </p>
        <p>
          Phone: <a href="tel:+233533846238">+233 53 384 6238</a><br />
          <a href="tel:+233531448173">+233 53 144 8173</a>
        </p>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>🗺️ We Deliver In:</h2>
        <iframe
          title="Coverage Map"
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

export default App;
