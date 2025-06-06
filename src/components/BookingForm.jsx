import React, { useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';

function BookingForm() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loadingFee, setLoadingFee] = useState(false);
  const [error, setError] = useState("");
  const [tip, setTip] = useState(0);
 const total = Number(deliveryFee) + Number(tipAmount || 0);


  // Pickup autocomplete
  const {
    ready: readyPickup,
    value: pickupValue,
    suggestions: { status: pickupStatus, data: pickupSuggestions },
    setValue: setPickupValue,
    clearSuggestions: clearPickupSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'gh' },
    },
    debounce: 300,
  });

  // Delivery autocomplete
  const {
    ready: readyDelivery,
    value: deliveryValue,
    suggestions: { status: deliveryStatus, data: deliverySuggestions },
    setValue: setDeliveryValue,
    clearSuggestions: clearDeliverySuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'gh' },
    },
    debounce: 300,
  });

  const handleSelectPickup = (address) => {
    setPickupValue(address, false);
    clearPickupSuggestions();
    setPickupAddress(address);
    triggerDistanceCalculation(address, deliveryAddress);
  };

  const handleSelectDelivery = (address) => {
    setDeliveryValue(address, false);
    clearDeliverySuggestions();
    setDeliveryAddress(address);
    triggerDistanceCalculation(pickupAddress, address);
  };

  const handlePickupInput = (e) => {
    setPickupValue(e.target.value);
    setPickupAddress(e.target.value);
  };

  const handleDeliveryInput = (e) => {
    setDeliveryValue(e.target.value);
    setDeliveryAddress(e.target.value);
  };

  const triggerDistanceCalculation = async (pickup, delivery) => {
    setError(null);
    if (!pickup || !delivery) {
      setDistance(null);
      setDeliveryFee(null);
      return;
    }

    setLoadingFee(true);
    try {
      const response = await fetch('http://localhost:5000/api/submit-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickupAddress: pickup, deliveryAddress: delivery }),
      });
      if (!response.ok) throw new Error('Failed to get fee');
      const data = await response.json();
      setDistance(data.distance);
      setDeliveryFee(data.deliveryFee);
    } catch (err) {
      setError('Error calculating delivery fee. Please try again.');
      setDistance(null);
      setDeliveryFee(null);
    } finally {
      setLoadingFee(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^(\+233|0)[235]{1}[0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const pickupPhone = e.target.elements["pickupPhone"]?.value;
    const deliveryPhone = e.target.elements["deliveryPhone"]?.value;
    const email = e.target.elements["email"]?.value;

    if (!phoneRegex.test(pickupPhone)) {
      alert("Please enter a valid pickup phone number.");
      return;
    }

    if (!phoneRegex.test(deliveryPhone)) {
      alert("Please enter a valid delivery phone number.");
      return;
    }

    if (email && !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Form is valid, allow submission to continue
    e.target.submit();
  };

  return (
    <form
  id="delivery-form"
  className="booking-form"
  action="https://formsubmit.co/seeyousoon.deliveries@gmail.com"
  method="POST"
  onSubmit={handleSubmit}
>

      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_redirect" value="https://seeyousoondeliveries.com/thank-you" />

      <input type="text" placeholder="🔢 Order Number" name="orderNumber" required className="bold-input" />

      <fieldset>
        <legend>📍 Pick-up From</legend>
        <input type="text" placeholder="🏪 Store Name" name="storeName" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="pickupPhone" required />

        {/* Pickup autocomplete */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="📍 Store Address"
            name="pickupAddress"
            value={pickupValue}
            onChange={handlePickupInput}
            disabled={!readyPickup}
            required
            autoComplete="off"
          />
          {pickupStatus === 'OK' && (
            <ul className="autocomplete-dropdown">
              {pickupSuggestions.map(({ place_id, description }) => (
                <li key={place_id} onClick={() => handleSelectPickup(description)} tabIndex={0}>
                  {description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input type="time" name="pickupTime" defaultValue="11:10" placeholder="optional" />
        <input type="date" name="pickupDate" defaultValue="2025-05-30" placeholder="optional" />
      </fieldset>

      <fieldset>
        <legend>🎯 Deliver To</legend>
        <input type="text" placeholder="👤 Customer Name" name="customerName" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="deliveryPhone" required />
        <input type="email" placeholder="✉️ Email Address optional" name="email" />

        {/* Delivery autocomplete */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="📍 Delivery Address"
            name="deliveryAddress"
            value={deliveryValue}
            onChange={handleDeliveryInput}
            disabled={!readyDelivery}
            required
            autoComplete="off"
          />
          {deliveryStatus === 'OK' && (
            <ul className="autocomplete-dropdown">
              {deliverySuggestions.map(({ place_id, description }) => (
                <li key={place_id} onClick={() => handleSelectDelivery(description)} tabIndex={0}>
                  {description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input type="date" name="deliveryDate" defaultValue="2025-05-30" placeholder="optional" />
        <input type="time" name="deliveryTime" defaultValue="11:50" placeholder="optional" />
      </fieldset>

      <fieldset>
        <legend>🧾 Order Details</legend>
        <input type="text" placeholder="🛒 Item Name" name="itemName" />
        <input
        type="number"
        placeholder="🚚 Delivery Fees (₵)"
        name="deliveryFees"
        value={deliveryFee ?? ''}
        readOnly
        />
        <input
        type="number"
        placeholder="🎁 Tips (₵)"
        name="tips"
        value={tip}
        onChange={(e) => setTip(e.target.value)}
        />
        {deliveryFee > 0 && (
  <div className="fee-summary">
    <p>Estimated Delivery Fee: <strong>GH₵{deliveryFee.toFixed(2)}</strong></p>
    <p>Tip: <strong>GH₵{Number(tipAmount).toFixed(2)}</strong></p>
    <hr />
    <p className="total">Total: <strong>GH₵{total.toFixed(2)}</strong></p>
  </div>
)}

        <input
        type="text"
        name="total"
        value={`GH₵${total.toFixed(2)}`}
        readOnly
        />

 

      </fieldset>

      <textarea placeholder="🗒️ Any fun delivery instructions?" rows={3} name="instructions"></textarea>

      <select required name="paymentMethod">
        <option value="">💳 Choose a Payment Method</option>
        <option value="cash">💵 Cash on Delivery</option>
        <option value="momo">📱 Mobile Money</option>
      </select>

      {loadingFee && <p>Calculating delivery fee...</p>}
      {distance && (
        <p>
          Distance: {distance} km — Delivery Fee: ₵{deliveryFee}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">🎉 Submit Order</button>
    </form>
  );
}

export default BookingForm;
