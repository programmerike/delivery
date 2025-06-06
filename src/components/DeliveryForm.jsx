import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryForm() {
  const pickupInputRef = useRef(null);
  const deliveryInputRef = useRef(null);
  const pickupAutocompleteRef = useRef(null);
  const deliveryAutocompleteRef = useRef(null);

  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [fee, setFee] = useState("");
  const [tip, setTip] = useState("");
  const [total, setTotal] = useState("");

  const navigate = useNavigate();

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject("Google Maps script failed to load");
      document.head.appendChild(script);
    });
  };

  const calculateFee = (pickup, delivery) => {
    if (!pickup || !delivery) return;
    const baseFee = 18;
    const distanceFactor = Math.abs(pickup.length - delivery.length) * 0.5;
    const feeCalc = baseFee + distanceFactor;
    setFee(feeCalc.toFixed(2));
  };

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        if (!window.google) return;

        pickupAutocompleteRef.current = new google.maps.places.Autocomplete(
          pickupInputRef.current,
          {
            componentRestrictions: { country: "gh" },
          }
        );
        pickupAutocompleteRef.current.addListener("place_changed", () => {
          const place = pickupAutocompleteRef.current.getPlace();
          if (place?.formatted_address) {
            setPickupAddress(place.formatted_address);
            calculateFee(place.formatted_address, deliveryAddress);
          }
        });

        deliveryAutocompleteRef.current = new google.maps.places.Autocomplete(
          deliveryInputRef.current,
          {
            componentRestrictions: { country: "gh" },
          }
        );
        deliveryAutocompleteRef.current.addListener("place_changed", () => {
          const place = deliveryAutocompleteRef.current.getPlace();
          if (place?.formatted_address) {
            setDeliveryAddress(place.formatted_address);
            calculateFee(pickupAddress, place.formatted_address);
          }
        });
      })
      .catch(console.error);

    return () => {
      pickupAutocompleteRef.current = null;
      deliveryAutocompleteRef.current = null;
    };
  }, [pickupAddress, deliveryAddress]);

  useEffect(() => {
    const numericTip = parseFloat(tip) || 0;
    const numericFee = parseFloat(fee) || 0;
    setTotal((numericFee + numericTip).toFixed(2));
  }, [fee, tip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const pickupCode = Math.floor(1000 + Math.random() * 9000);
    const deliveryCode = Math.floor(1000 + Math.random() * 9000);
    const formData = {
      pickupAddress,
      deliveryAddress,
      customerName,
      customerPhone,
      customerEmail,
      deliveryFee,
      tip,
      total: deliveryFee + Number(tip),
    };

    navigate("/thank-you", {
      state: { orderNumber, fee, tip, total, pickupCode, deliveryCode },
    });
  };

  return (
    <div id="delivery-form">
      <div
        className="delivery-form-wrapper"
        style={{ maxWidth: "700px", margin: "auto", padding: "1rem" }}
      >
        <form className="delivery-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>📍 Pick-up From</legend>
            <input type="text" placeholder="🏪 Store Name" required />
            <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
            <input
              type="text"
              placeholder="📍 Store Address"
              required
              ref={pickupInputRef}
              defaultValue={pickupAddress}
              className="fancy-input"
            />
            <input type="time" defaultValue="11:10" />
            <input type="date" defaultValue="2025-05-30" />
          </fieldset>

          <fieldset>
            <legend>🎯 Deliver To</legend>
            <input type="text" placeholder="👤 Customer Name" required />
            <input type="tel" placeholder="📞 +233 (000) 000-00-00" required />
            <input type="email" placeholder="✉️ Email Address optional" />
            <input
              type="text"
              placeholder="📍 Delivery Address"
              required
              ref={deliveryInputRef}
              defaultValue={deliveryAddress}
              className="fancy-input"
            />
            <input type="date" defaultValue="2025-05-30" />
            <input type="time" defaultValue="11:50" />
          </fieldset>

          <fieldset>
            <legend>🧾 Order Details</legend>
            <input type="text" placeholder="🛒 Item Name" />
            <input
              type="number"
              placeholder="🚚 Delivery Fees (₵)"
              value={fee}
              readOnly
            />
            <input
              type="number"
              placeholder="🎁 Tips (₵)"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
            />
            <input
              type="number"
              placeholder="💵 Total (₵)"
              value={total}
              readOnly
            />
          </fieldset>

          <textarea
            placeholder="🗒 Any fun delivery instructions?"
            rows={3}
          ></textarea>

          <select required>
            <option value="">💳 Choose a Payment Method</option>
            <option value="cash">💵 Cash on Delivery</option>
            <option value="momo">📱 Mobile Money</option>
            <option value="card">💳 Credit/Debit Card</option>
          </select>

          <button
            type="submit"
            className="animated-submit"
            style={{ marginTop: "1rem" }}
          >
            🚀 Submit Delivery
          </button>
        </form>

        <section
          className="contact-us-section"
          style={{
            marginTop: "3rem",
            padding: "2rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "400px",
              fontSize: "1.1rem",
              lineHeight: "1.5",
            }}
          >
            <h2>
              <i>Contact Us</i>
            </h2>
            <p>
              📍 <strong>Address:</strong> 4 St Adom, Community 22, Tema
            </p>
            <p>
              📞 <strong>Phone:</strong>{" "}
              <a
                href="tel:+233533846238"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                +233 53 384 6238
              </a>{" "}
              /{" "}
              <a
                href="tel:+233531448173"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                +233 53 144 8173
              </a>
            </p>
            <p>
              ✉️ <strong>Email:</strong>{" "}
              <a
                href="mailto:seeyousoon.deliveries@gmail.com"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                seeyousoon.deliveries@gmail.com
              </a>
            </p>
          </div>

          <h1>
            <i>We deliver in:</i>
          </h1>
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            <iframe
              title="SeeYouSoon Courier Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.790455122976!2d-0.20701008476375633!3d5.60371799576252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b0db5f54821%3A0x3c6dd1851ca3f5ec!2sAccra%2C%20Greater%20Accra%20Region%2C%20Ghana!5e0!3m2!1sen!2sus!4v1685956113406!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}
