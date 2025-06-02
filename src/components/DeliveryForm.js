import React, { useState, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const GOOGLE_API_KEY = 'AIzaSyAe6wL6YBhQq6hKcZJvIBpe5Lr_wh_1aJQ'; // Replace with your key
const SHIPDAY_BACKEND_ENDPOINT = 'http://localhost:5000/api/create-order';

const BASE_FEE = 22;
const BASE_DISTANCE_KM = 3;
const RATE_PER_KM = 3;
const libraries = ['places'];

export default function DeliveryForm() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [formData, setFormData] = useState({});
  const [distanceKm, setDistanceKm] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const handleAutocompleteLoad = (ref, setter) => {
    return (autocomplete) => {
      ref.current = autocomplete;
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setter(place.formatted_address);
        }
      });
    };
  };

  const calculateDistance = async () => {
    if (!pickup || !dropoff) {
      alert('Please select both pickup and drop-off addresses first.');
      return;
    }

    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
      pickup
    )}&destinations=${encodeURIComponent(dropoff)}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();
    

    try {
      const meters = data.rows[0].elements[0].distance.value;
      const km = meters / 1000;
      setDistanceKm(km);

      const extra = Math.max(0, km - BASE_DISTANCE_KM);
      const fee = BASE_FEE + extra * RATE_PER_KM;
      setDeliveryFee(fee.toFixed(2));
    } catch (err) {
      console.error('Distance calculation error:', err);
      alert('Could not calculate distance. Please check addresses.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderPayload = {
      pickupAddress: pickup,
      pickupName: formData.pickupContact,
      pickupPhoneNumber: formData.pickupPhone,
      deliveryAddress: dropoff,
      customerName: formData.recipientName,
      phoneNumber: formData.recipientPhone,
      instructions: formData.instructions || '',
      items: [formData.itemDescription],
      orderNumber: `SYS-${Date.now()}`,
      distanceKm,
      deliveryFee,
    };

    try {
      const res = await fetch(SHIPDAY_BACKEND_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

        const data = await res.json();
    console.log('Order created:', data);
  

      if (res.ok) {
        window.location.href = '/thank-you';
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <LoadScript googleMapsApiKey={AIzaSyAe6wL6YBhQq6hKcZJvIBpe5Lr_wh_1aJQ} libraries={libraries}>
      <form className="delivery-form" onSubmit={handleSubmit}>
        <h2>Place a Delivery Order</h2>

        <label>Pickup Address *</label>
        <Autocomplete onLoad={handleAutocompleteLoad(pickupRef, setPickup)}>
          <input required placeholder="Enter pickup address" />
        </Autocomplete>

        <label>Drop-off Address *</label>
        <Autocomplete onLoad={handleAutocompleteLoad(dropoffRef, setDropoff)}>
          <input required placeholder="Enter drop-off address" />
        </Autocomplete>

        <label>Pickup Contact *</label>
        <input
          required
          onChange={(e) =>
            setFormData({ ...formData, pickupContact: e.target.value })
          }
        />

        <label>Pickup Phone *</label>
        <input
          required
          onChange={(e) =>
            setFormData({ ...formData, pickupPhone: e.target.value })
          }
        />
        <label>Recipient Name *</label>
        <input
          required
          onChange={(e) =>
            setFormData({ ...formData, recipientName: e.target.value })
          }
        />

        <label>Recipient Phone *</label>
        <input
          required
          onChange={(e) =>
            setFormData({ ...formData, recipientPhone: e.target.value })
          }
        />

        <label>Item Description *</label>
        <textarea
          required
          onChange={(e) =>
            setFormData({ ...formData, itemDescription: e.target.value })
          }
        />

        <label>Instructions (optional)</label>
        <textarea
          onChange={(e) =>
            setFormData({ ...formData, instructions: e.target.value })
          }
        />

        <button type="button" onClick={calculateDistance}>
          Calculate Delivery Fee
        </button>

        {deliveryFee && (
          <p>
            Distance: {distanceKm?.toFixed(2)} km — Fee:{' '}
            <strong>{deliveryFee} GHS</strong>
          </p>
        )}

        <button type="submit">Submit Order</button>
      </form>
    </LoadScript>
  );
}