import React, { useState, useRef, useEffect } from 'react';

function BookingForm() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loadingFee, setLoadingFee] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tip, setTip] = useState(0);

  const pickupRef = useRef(null);
  const deliveryRef = useRef(null);

  const total = Number(deliveryFee) + Number(tip || 0);

  useEffect(() => {
  if (window.google && 'PlaceAutocompleteElement' in window.google.maps.places) {
    // Create pickup autocomplete
    const pickupInput = new window.google.maps.places.PlaceAutocompleteElement();
    pickupInput.setAttribute('placeholder', 'Enter pickup location');
    pickupRef.current.innerHTML = '';
    pickupRef.current.appendChild(pickupInput);

    pickupInput.addEventListener('gmp-place-select', (e) => {
      const address = e?.detail?.place?.formattedAddress;
      if (address) {
        setPickupAddress(address);
        triggerDistanceCalculation(address, deliveryAddress);
      }
    });

    // Create delivery autocomplete
    const deliveryInput = new window.google.maps.places.PlaceAutocompleteElement();
    deliveryInput.setAttribute('placeholder', 'Enter delivery location');
    deliveryRef.current.innerHTML = '';
    deliveryRef.current.appendChild(deliveryInput);

    deliveryInput.addEventListener('gmp-place-select', (e) => {
      const address = e?.detail?.place?.formattedAddress;
      if (address) {
        setDeliveryAddress(address);
        triggerDistanceCalculation(pickupAddress, address);
      }
    });
  } else {
    // Fallback: use text input fields
    pickupRef.current.innerHTML = <input type="text" placeholder="Enter pickup location manually" class="fallback-address" />;
    deliveryRef.current.innerHTML = <input type="text" placeholder="Enter delivery location manually" class="fallback-address" />;

    // Add manual listeners
    const pickupManual = pickupRef.current.querySelector('input');
    const deliveryManual = deliveryRef.current.querySelector('input');

    pickupManual.addEventListener('blur', () => {
      setPickupAddress(pickupManual.value);
      triggerDistanceCalculation(pickupManual.value, deliveryAddress);
    });

    deliveryManual.addEventListener('blur', () => {
      setDeliveryAddress(deliveryManual.value);
      triggerDistanceCalculation(pickupAddress, deliveryManual.value);
    });
  }
}, []);

  const triggerDistanceCalculation = async (pickup, delivery) => {
    setError(null);
    if (!pickup || !delivery) {
      setDistance(null);
      setDeliveryFee(0);
      return;
    }

    setLoadingFee(true);
    try {
      const response = await fetch('https://delivery-u9ub.onrender.com/calculate-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickupAddress: pickup, deliveryAddress: delivery }),
      });

      if (!response.ok) throw new Error('Failed to get fee');
      const data = await response.json();

      setDistance(data.distance);
      setDeliveryFee(data.fee);
    } catch (err) {
      console.error(err);
      setError('Error calculating delivery fee. Please try again.');
      setDistance(null);
      setDeliveryFee(0);
    } finally {
      setLoadingFee(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const phoneRegex = /^(\+233|0)[235]{1}[0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const form = e.target;
    const pickupPhone = form["pickupPhone"].value;
    const deliveryPhone = form["deliveryPhone"].value;
    const email = form["email"].value;

    if (!phoneRegex.test(pickupPhone)) {
      alert("Please enter a valid pickup phone number.");
      setSubmitting(false);
      return;
    }

    if (!phoneRegex.test(deliveryPhone)) {
      alert("Please enter a valid delivery phone number.");
      setSubmitting(false);
      return;
    }

    if (email && !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    const orderData = {
      orderNumber: form["orderNumber"].value,
      storeName: form["storeName"].value,
      pickupPhone,
      pickupAddress,
      pickupTime: form["pickupTime"].value,
      pickupDate: form["pickupDate"].value,
      customerName: form["customerName"].value,
      deliveryPhone,
      deliveryAddress,
      deliveryDate: form["deliveryDate"].value,
      deliveryTime: form["deliveryTime"].value,
      itemName: form["itemName"].value,
      deliveryFees: deliveryFee,
      tips: tip,
      total,
      instructions: form["instructions"]?.value || "",
      paymentMethod: form["paymentMethod"]?.value || "",
      email: email || null,
    };

    try {
      const res = await fetch('https://delivery-u9ub.onrender.com/submit-order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      console.log("Backend response:", result);

      if (res.ok && result.success) {
        window.location.href = "https://seeyousoondeliveries.com/thank-you";
      } else {
        alert("Order submission failed. Please try again.");
      }
    } catch (err) {
      alert("Network or server error. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="delivery-form" className="booking-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="🔢 Order Number" name="orderNumber" required className="bold-input" />

      <fieldset>
        <legend>📍 Pick-up From</legend>
        <input type="text" placeholder="🏪 Store Name" name="storeName" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="pickupPhone" required />
        <PlacesInput
  label="Pickup Location"
  onPlaceSelected={(place) => {
    setPickupAddress(place);
    triggerDistanceCalculation(place, deliveryAddress);
  }}
/>
        <input type="time" name="pickupTime" defaultValue="11:10" />
        <input type="date" name="pickupDate" defaultValue="2025-05-30" />
      </fieldset>

      <fieldset>
        <legend>🎯 Deliver To</legend>
        <input type="text" placeholder="👤 Customer Name" name="customerName" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="deliveryPhone" required />
        <input type="email" placeholder="✉️ Email Address optional" name="email" />
        <PlacesInput
  label="Delivery Location"
  onPlaceSelected={(place) => {
    setDeliveryAddress(place);
    triggerDistanceCalculation(pickupAddress, place);
  }}
/>
        <input type="date" name="deliveryDate" defaultValue="2025-05-30" />
        <input type="time" name="deliveryTime" defaultValue="11:50" />
      </fieldset>

      <fieldset>
        <legend>🧾 Order Details</legend>
        <input type="text" placeholder="🛒 Item Name" name="itemName" />
        <input type="number" placeholder="🚚 Delivery Fees (₵)" name="deliveryFees" value={deliveryFee} readOnly />
        <input
          type="number"
          placeholder="🎁 Tips (₵)"
          name="tips"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          min="0"
        />
        <input type="number" placeholder="💰 Total (₵)" name="total" value={total} readOnly />
        <textarea placeholder="📝 Special Instructions" name="instructions"></textarea>
        <select name="paymentMethod" defaultValue="">
          <option value="" disabled>Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="Mobile Money">Mobile Money</option>
        </select>
      </fieldset>

      {loadingFee && <p>Calculating fee...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={submitting || loadingFee}>
        {submitting ? (
          <>
            <span className="spinner" /> Submitting...
          </>
        ) : "Submit Order"}
      </button>
    </form>
  );
}

export default BookingForm;