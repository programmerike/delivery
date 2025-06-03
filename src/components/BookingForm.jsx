import React, { useState, useRef, useEffect } from 'react';
import './BookingForm.css'; // Optional: your form styles

const BookingForm = () => {
  const [distance, setDistance] = useState(null);
  const [fee, setFee] = useState(0);

  const storeAddressRef = useRef(null);
  const deliveryAddressRef = useRef(null);

  // Load Google Places Autocomplete
  useEffect(() => {
    if (window.google && window.google.maps) {
      new window.google.maps.places.Autocomplete(storeAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' },
      });

      new window.google.maps.places.Autocomplete(deliveryAddressRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'gh' },
      });
    }
  }, []);

  // Distance & fee calculation
  const calculateDistance = () => {
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [storeAddressRef.current.value],
        destinations: [deliveryAddressRef.current.value],
        travelMode: 'DRIVING',
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK') {
          const distanceInKm = response.rows[0].elements[0].distance.value / 1000;
          setDistance(distanceInKm);
          setFee(computeFee(distanceInKm));
        }
      }
    );
  };

  const computeFee = (km) => {
    if (km <= 3) return 18;
    if (km <= 4.5) return 22;
    return 22 + Math.ceil((km - 4.5) / 2) * 4;
  };

  return (
    <section className="booking-section" id="booking">
      <div className="order-container">
        <h2>Let's Make a Delivery!</h2>

        <form
          className="booking-form"
          action="https://formsubmit.co/seeyousoon.deliveries@gmail.com"
          method="POST"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_redirect" value="https://seeyousoondeliveries.com/thank-you" />

          <input type="text" name="orderNumber" placeholder="🔢 Order Number" required className="bold-input" />

          <fieldset>
            <legend>📍 Pick-up From</legend>
            <input type="text" name="storeName" placeholder="🏪 Store Name" required />
            <input type="tel" name="storePhone" placeholder="📞 +233 (000) 000-00-00" required />
            <input
              type="text"
              name="storeAddress"
              placeholder="📍 Store Address"
              ref={storeAddressRef}
              onBlur={calculateDistance}
              required
            />
            <input type="time" name="pickupTime" />
            <input type="date" name="pickupDate" />
          </fieldset>

          <fieldset>
            <legend>🎯 Deliver To</legend>
            <input type="text" name="customerName" placeholder="👤 Customer Name" required />
            <input type="tel" name="customerPhone" placeholder="📞 +233 (000) 000-00-00" required />
            <input type="email" name="customerEmail" placeholder="✉️ Email Address optional" />
            <input
              type="text"
              name="deliveryAddress"
              placeholder="📍 Delivery Address"
              ref={deliveryAddressRef}
              onBlur={calculateDistance}
              required
            />
            <input type="date" name="deliveryDate" />
            <input type="time" name="deliveryTime" />
          </fieldset>

          <fieldset>
            <legend>🧾 Order Details</legend>
            <input type="text" name="itemName" placeholder="🛒 Item Name" />
            <input
              type="number"
              name="deliveryFee"
              value={fee}
              placeholder="🚚 Delivery Fee (₵)"
              readOnly
            />
            <input type="number" name="tips" placeholder="🎁 Tips (₵)" />
            <input
              type="number"
              name="total"
              placeholder="💵 Total (₵)"
              value={fee} // optionally add tips logic
              readOnly
            />
          </fieldset>

          <textarea name="instructions" placeholder="🗒️ Any fun delivery instructions?" rows={3}></textarea>

          <select name="paymentMethod" required>
            <option value="">💳 Choose a Payment Method</option>
            <option value="cash">💵 Cash on Delivery</option>
            <option value="momo">📱 Mobile Money</option>
            <option value="card">💳 Credit/Debit Card</option>
          </select>

          <button type="submit">🎉 Submit Order</button>
        </form>

        {distance && (
          <div className="distance-summary">
            <p>🚗 Distance: {distance.toFixed(2)} km</p>
            <p>💵 Estimated Delivery Fee: GH₵{fee}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingForm;
