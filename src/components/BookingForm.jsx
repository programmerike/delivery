import React, { useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { PlaceAutocompleteElement } from '@googlemaps/places-widget';
import './BookingForm.css';

function BookingForm() {
  const [pickupAddress, setPickupAddress] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [distance, setDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loadingFee, setLoadingFee] = useState(false);
  const [error, setError] = useState('');
  const [tip, setTip] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = Number(deliveryFee) + Number(tip || 0);

  const {
    ready: readyPickup,
    value: pickupValue,
    suggestions: { status: pickupStatus, data: pickupSuggestions },
    setValue: setPickupValue,
    clearSuggestions: clearPickupSuggestions,
  } = usePlacesAutocomplete({ requestOptions: { componentRestrictions: { country: 'gh' } }, debounce: 300 });

  const {
    ready: readyDelivery,
    value: deliveryValue,
    suggestions: { status: deliveryStatus, data: deliverySuggestions },
    setValue: setDeliveryValue,
    clearSuggestions: clearDeliverySuggestions,
  } = usePlacesAutocomplete({ requestOptions: { componentRestrictions: { country: 'gh' } }, debounce: 300 });

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
    setIsSubmitting(true);

    const form = e.target;

    const phoneRegex = /^(\+233|0)[235]{1}[0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const pickupPhone = form['pickupPhone'].value;
    const deliveryPhone = form['deliveryPhone'].value;
    const email = form['email'].value;

    if (!pickupAddress || !deliveryAddress) {
      alert('Pickup and delivery addresses are required.');
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(pickupPhone)) {
      alert('Invalid pickup phone number.');
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(deliveryPhone)) {
      alert('Invalid delivery phone number.');
      setIsSubmitting(false);
      return;
    }

    if (email && !emailRegex.test(email)) {
      alert('Invalid email address.');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      orderNumber: form['orderNumber'].value,
      storeName: form['storeName'].value,
      pickupPhone,
      pickupAddress,
      pickupTime: form['pickupTime'].value,pickupDate: form['pickupDate'].value,
      customerName: form['customerName'].value,
      deliveryPhone,
      deliveryAddress,
      deliveryDate: form['deliveryDate'].value,
      deliveryTime: form['deliveryTime'].value,
      itemName: form['itemName'].value,
      deliveryFees: deliveryFee,
      tips: tip,
      total,
      instructions: form['instructions'] ? form['instructions'].value : '',
      paymentMethod: form['paymentMethod'] ? form['paymentMethod'].value : '',
      email: email || null,
    };

    try {
      const res = await fetch('https://delivery-u9ub.onrender.com/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = '/thank-you';
        }, 2000);
      } else {
        alert('Submission failed: ' + (data.error || 'Unknown error'));
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Network error or server not responding.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="fullscreen-loading">
        <div className="spinner"></div>
        {showSuccess ? (
          <div className="success-message">✅ Order submitted successfully!</div>
        ) : (
          <p>Submitting your order...</p>
        )}
      </div>
    );
  }

  return (
    <form id="delivery-form" className="booking-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="🔢 Order Number" name="orderNumber" required className="bold-input" />

      <fieldset>
        <legend>📍 Pick-up From</legend>
        <input type="text" placeholder="🏪 Store Name" name="storeName" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="pickupPhone" required />

        <div style={{ position: 'relative' }}>
          <PlaceAutocompleteElement
            onPlaceChanged={(e) => setPickupAddress(e.detail)}
          />
        </div>

        <input type="time" name="pickupTime" defaultValue="11:10" />
        <input type="date" name="pickupDate" defaultValue="2025-06-10" />
      </fieldset>

      <fieldset>
        <legend>🎯 Deliver To</legend>
        <input type="text" placeholder="👤 Customer Name" name="customerName" required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="deliveryPhone" required />
        <input type="email" placeholder="✉️ Email Address optional" name="email" />

        <div style={{ position: 'relative' }}>
          <PlaceAutocompleteElement
            onPlaceChanged={(e) => setDeliveryAddress(e.detail)}
          />
        </div>

        <input type="date" name="deliveryDate" defaultValue="2025-06-10" />
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

      {loadingFee && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Calculating delivery fee...</p>
        </div>
      )}{error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loadingFee || isSubmitting}>
        {loadingFee ? 'Calculating Fee...' : 'Submit Order'}
      </button>
    </form>
  );
}

export default BookingForm;