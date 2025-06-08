import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeliveryForm from "./components/DeliveryForm";
import ThankYou from "./components/ThankYou"; // Make sure casing matches file exactly
import './App.css';
import Hero from "./components/Hero";
import HomePage from "./components/HomePage";
import OurServices from "./components/OurServices";



function MainApp() {
  const storeAddressRef = useRef(null);
  const deliveryAddressRef = useRef(null);
  const storeLocation = { lat: 5.6148, lng: -0.2058 }; // Replace with dynamic state if needed
  const deliveryLocation = { lat: 5.6500, lng: -0.1900 }; // Replace with dynamic state if needed

  
  
  return (
    <div>
      <Hero />
      <OurServices />
      <DeliveryForm />
    
    <div className="form-container">
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
        <input type="email" placeholder="✉️ Email Address (optional)" />
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

      <textarea placeholder="🗒 Any fun delivery instructions?" rows={3}></textarea>

      <select required>
        <option value="">💳 Choose a Payment Method</option>
        <option value="cash">💵 Cash on Delivery</option>
        <option value="momo">📱 Mobile Money</option>
        <option value="card">💳 Credit/Debit Card</option>
      </select>
      <button type="submit" className="animated-submit">🚀 Submit Delivery</button>
      
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
  </div>
  );
}

export default function App() {
  return (
    <div className="App"> 
   
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </div>
  );
}
