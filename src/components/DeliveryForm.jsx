import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "../styles/delivery.css";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

export default function DeliveryForm() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const formRef = useRef(null);
  const pickupRef = useRef(null);
  const deliveryRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [fee, setFee] = useState(null);
  const [tip, setTip] = useState("");
  const [total, setTotal] = useState(null);
  const navigate = useNavigate();

  const calculateFee = async (pickup, delivery) => {
    if (!pickup || !delivery) return;
    try {
      const res = await axios.post("http://localhost:5000/calculate-fee", {
        pickupAddress: pickup,
        deliveryAddress: delivery,
      });
      setFee(res.data.fee);
    } catch (err) {
      console.error("Fee calculation failed", err);
    }
  };

  const handlePickupSelect = () => {
    const place = pickupRef.current.getPlace();
    const address = place?.formatted_address || "";
    setPickupAddress(address);
    calculateFee(address, deliveryAddress);
  };

  const handleDeliverySelect = () => {
    const place = deliveryRef.current.getPlace();
    const address = place?.formatted_address || "";
    setDeliveryAddress(address);
    calculateFee(pickupAddress, address);
  };

  useEffect(() => {
    const numericTip = parseFloat(tip) || 0;
    const numericFee = parseFloat(fee) || 0;
    setTotal(numericFee + numericTip);
  }, [fee, tip]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (formRef.current) observer.observe(formRef.current);
    return () => {
      if (formRef.current) observer.unobserve(formRef.current);
    };
  }, []);
const handleSubmit = async (e) => {
  e.preventDefault();

  // Example: generate an order number and verification codes
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const pickupCode = Math.floor(1000 + Math.random() * 9000);
  const deliveryCode = Math.floor(1000 + Math.random() * 9000);

  // You can optionally send data to your backend here

  // Navigate to thank-you page
  navigate("/thank-you", {
    state: {
      orderNumber,
      fee,
      tip,
      total,
      pickupCode,
      deliveryCode,
    },
  });
};
  return (
    <div
      id="delivery-form"
      ref={formRef}
      className={`form-container fade-in-section ${isVisible ? "visible" : ""}`}
    >
      <input type="text" placeholder="🔢 Order Number" required className="bold-input" />

      <fieldset>
        <legend>📍 Pick-up From</legend>
        <input type="text" placeholder="🏪 Store Name" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
        {isLoaded && (
          <Autocomplete onPlaceChanged={handlePickupSelect}>
            <input
              type="text"
              placeholder="📍 Store Address"
              required
              ref={pickupRef}
              className="fancy-input"
            />
          </Autocomplete>
        )}
        <input type="time" defaultValue="11:10" />
        <input type="date" defaultValue="2025-05-30" />
      </fieldset>

      <fieldset>
        <legend>🎯 Deliver To</legend>
        <input type="text" placeholder="👤 Customer Name" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
        <input type="email" placeholder="✉️ Email Address optional" />
        {isLoaded && (
          <Autocomplete onPlaceChanged={handleDeliverySelect}>
            <input
              type="text"
              placeholder="📍 Delivery Address"
              required
              ref={deliveryRef}
              className="fancy-input"
            />
          </Autocomplete>
        )}
        <input type="date" defaultValue="2025-05-30" />
        <input type="time" defaultValue="11:50" />
      </fieldset>

      <fieldset>
        <legend>🧾 Order Details</legend>
        <input type="text" placeholder="🛒 Item Name" />
        <input
          type="number"
          placeholder="🚚 Delivery Fees (₵)"
          value={fee || ""}
          readOnly
        />
        <input
          type="number"
          placeholder="🎁 Tips (₵)"value={tip}
          onChange={(e) => setTip(e.target.value)}
        />
        <input
          type="number"
          placeholder="💵 Total (₵)"
          value={total}
          readOnly
        />
      </fieldset>

      <textarea placeholder="🗒 Any fun delivery instructions?" rows={3}></textarea>

      <select required>
        <option value="">💳 Choose a Payment Method</option>
        <option value="cash">💵 Cash on Delivery</option>
        <option value="momo">📱 Mobile Money</option>
        <option value="card">💳 Credit/Debit Card</option>
      </select>

      <button onClick={handleSubmit} className="animated-submit">🚀 Submit Delivery</button>

      <section className="contact-section">
        <h2>📬 Contact Us</h2>
        <p>Email: <a href="mailto:seeyousoon.deliveries@gmail.com">seeyousoon.deliveries@gmail.com</a></p>
        <p>
          Phone: <a href="tel:+233533846238">+233 53 384 6238</a><br />
          <a href="tel:+233531448173">+233 53 144 8173</a>
        </p>
      </section>

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