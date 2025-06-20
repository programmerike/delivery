import { useState, useContext } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { PlaceAutocompleteElement } from '@googlemaps/places-widget';
import './BookingForm.css';
import { submitOrders } from '../api/auth';


function BookingForm() {
  // const [pickupAddress, setPickupAddress] = useState(null);
  // const [deliveryAddress, setDeliveryAddress] = useState(null);
  // const [distance, setDistance] = useState(null);
  // const [deliveryFee, setDeliveryFee] = useState(0);
  // const [loadingFee, setLoadingFee] = useState(false);
  // const [error, setError] = useState('');
  // const [tip, setTip] = useState(0);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);

  // const total = Number(deliveryFee) + Number(tip || 0);

  // const {
  //   ready: readyPickup,
  //   value: pickupValue,
  //   suggestions: { status: pickupStatus, data: pickupSuggestions },
  //   setValue: setPickupValue,
  //   clearSuggestions: clearPickupSuggestions,
  // } = usePlacesAutocomplete({ requestOptions: { componentRestrictions: { country: 'gh' } }, debounce: 300 });

  // const {
  //   ready: readyDelivery,
  //   value: deliveryValue,
  //   suggestions: { status: deliveryStatus, data: deliverySuggestions },
  //   setValue: setDeliveryValue,
  //   clearSuggestions: clearDeliverySuggestions,
  // } = usePlacesAutocomplete({ requestOptions: { componentRestrictions: { country: 'gh' } }, debounce: 300 });

  // const handleSelectPickup = (address) => {
  //   setPickupValue(address, false);
  //   clearPickupSuggestions();
  //   setPickupAddress(address);
  //   triggerDistanceCalculation(address, deliveryAddress);
  // };

  // const handleSelectDelivery = (address) => {
  //   setDeliveryValue(address, false);
  //   clearDeliverySuggestions();
  //   setDeliveryAddress(address);
  //   triggerDistanceCalculation(pickupAddress, address);
  // };

  // const handlePickupInput = (e) => {
  //   setPickupValue(e.target.value);
  //   setPickupAddress(e.target.value);
  // };

  // const handleDeliveryInput = (e) => {
  //   setDeliveryValue(e.target.value);
  //   setDeliveryAddress(e.target.value);
  // };

  // const triggerDistanceCalculation = async (pickup, delivery) => {
  //   setError(null);

  //   if (!pickup || !delivery) {
  //     setDistance(null);
  //     setDeliveryFee(0);
  //     return;
  //   }

  //   setLoadingFee(true);
  //   try {
  //     const response = await fetch('https://delivery-u9ub.onrender.com/calculate-fee', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ pickupAddress: pickup, deliveryAddress: delivery }),
  //     });

  //     if (!response.ok) throw new Error('Failed to get fee');

  //     const data = await response.json();
  //     setDistance(data.distance);
  //     setDeliveryFee(data.fee);
  //   } catch (err) {
  //     console.error(err);
  //     setError('Error calculating delivery fee. Please try again.');
  //     setDistance(null);
  //     setDeliveryFee(0);
  //   } finally {
  //     setLoadingFee(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   const form = e.target;

    // const phoneRegex = /^(\+233|0)[235]{1}[0-9]{8}$/;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // const pickupPhone = form['pickupPhone'].value;
    // const deliveryPhone = form['deliveryPhone'].value;
    // const email = form['email'].value;

    // if (!pickupAddress || !deliveryAddress) {
    //   alert('Pickup and delivery addresses are required.');
    //   setIsSubmitting(false);
    //   return;
    // }

    // if (!phoneRegex.test(pickupPhone)) {
    //   alert('Invalid pickup phone number.');
    //   setIsSubmitting(false);
    //   return;
    // }

    // if (!phoneRegex.test(deliveryPhone)) {
    //   alert('Invalid delivery phone number.');
    //   setIsSubmitting(false);
    //   return;
    // }

    // if (email && !emailRegex.test(email)) {
    //   alert('Invalid email address.');
    //   setIsSubmitting(false);
    //   return;
    // }

    // const orderData = {
    //   orderNumber: form['orderNumber'].value,
    //   storeName: form['storeName'].value,
    //   pickupPhone,
    //   pickupAddress,
    //   pickupTime: form['pickupTime'].value,pickupDate: form['pickupDate'].value,
    //   customerName: form['customerName'].value,
    //   deliveryPhone,
    //   deliveryAddress,
    //   deliveryDate: form['deliveryDate'].value,
    //   deliveryTime: form['deliveryTime'].value,
    //   itemName: form['itemName'].value,
    //   deliveryFees: deliveryFee,
    //   tips: tip,
    //   total,
    //   instructions: form['instructions'] ? form['instructions'].value : '',
    //   paymentMethod: form['paymentMethod'] ? form['paymentMethod'].value : '',
    //   email: email || null,
    // };

//     try {
//       const res = await submitOrders(orderData);

//       !res ? setIsSubmitting(false) : setShowSuccess(true)
//       setTimeout(() => {
//   window.location.href = `/thank-you?order=${encodeURIComponent(JSON.stringify(orderData))}`;
// }, 2000)
//       if (res.ok && data.success) {
//         setShowSuccess(true);
//       } else {
//         alert('Submission failed: ' + (data.error || 'Unknown error'));
//         setIsSubmitting(false);
//       }
//     } catch (err) {
//       console.error('Error submitting order:', err);
//       alert('Network error or server not responding.');
//       setIsSubmitting(false);
//     }
//   };

//   if (isSubmitting) {
//     return (
//       <div className="fullscreen-loading">
//         <div className="spinner"></div>
//         {showSuccess ? (
//           <div className="success-message">✅ Order submitted successfully!</div>
//         ) : (
//           <p>Submitting your order...</p>
//         )}
//       </div>
//     );
//   }



const [form, setForm] = useState({ email: '', password: '', orderNumber: '', storeName: '',pickupPhone: '',pickupTime: '',pickupDate: '',customerName: '',deliveryPhone: '',deliveryDate: '', deliveryTime: '', itemName: '', deliveryFees: '', tips: '', total: '', instructions: '', paymentMethod: '', total:  "100" });
 
const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      !res ? null : setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <form id="delivery-form" className="booking-form" onSubmit={handleSubmit} method='post' action='http://www.localhost:5000/submit-order'>
      <input type="text" placeholder="🔢 Order Number" name="orderNumber" required className="bold-input" />

      <fieldset>
        <legend>📍 Pick-up From</legend>
        <input type="text" placeholder="🏪 Store Name" name="storeName" value={form.storeName} onChange={handleChange} required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="pickupPhone" value={form.pickupPhone} onChange={handleChange} required />
        <input type="text" placeholder="Pick up Address" name="pickupDate" value={form.pickupDate} onChange={handleChange} required />
        <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} defaultValue="11:10" />
        <input type="date" name="pickupDate"value={form.pickupDate} onChange={handleChange} defaultValue="2025-06-10" />
      </fieldset>

      <fieldset>
        <legend>🎯 Deliver To</legend>
        <input type="text" placeholder="👤 Customer Name" name="customerName" value={form.customerName} onChange={handleChange} required />
        <input type="tel" placeholder="📞 +233 (000) 000-00-00" name="deliveryPhone" value={form.deliveryPhone} onChange={handleChange} required />
        <input type="email" placeholder="✉️ Email Address optional" name="email" value={form.email} onChange={handleChange} />
        
        <div style={{ position: 'relative' }}>
          <PlaceAutocompleteElement
            onPlaceChanged={(e) => setDeliveryAddress(e.detail)}
          />
        </div>

        <input type="date" name="deliveryDate" defaultValue="2025-06-10" value={form.deliveryDate} onChange={handleChange}/>
        <input type="time" name="deliveryTime" defaultValue="11:50" value={form.deliveryTime} onChange={handleChange} />
      </fieldset>

      <fieldset>
        <legend>🧾 Order Details</legend>
        <input type="text" placeholder="🛒 Item Name" name="itemName" value={form.itemName} onChange={handleChange}/>
        <input type="number" placeholder="🚚 Delivery Fees (₵)" name="deliveryFees" value={form.deliveryFees} onChange={handleChange} readOnly />
        <input
          type="number"
          placeholder="🎁 Tips (₵)"
          name="tips"
          value={form.tips} 
          onChange={handleChange}
          min="0"
        />
        <input type="number" placeholder="💰 Total (₵)" name="total" value={form.total} onChange={handleChange} readOnly />
        <textarea placeholder="📝 Special Instructions" name="instructions"></textarea>

        <select name="paymentMethod" defaultValue="" value={form.paymentMethod} onChange={handleChange}>
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

      <button type="submit">
        {loadingFee ? 'Calculating Fee...' : 'Submit Order'}
      </button>
    </form>
  );
}

export default BookingForm;
