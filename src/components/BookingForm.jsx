import React, { useState, useEffect, useRef } from "react";



function PlaceAutocomplete({ onPlaceSelected }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places?.PlaceAutocompleteElement && inputRef.current) {
        clearInterval(interval);

        const autocomplete = new window.google.maps.places.PlaceAutocompleteElement();
        autocomplete.setAttribute('placeholder', 'Enter address...');
        autocomplete.addEventListener('place_changed', () => {
          const place = autocomplete.getPlace();
          onPlaceSelected(place);
        });

        inputRef.current.innerHTML = ''; // Clear previous
        inputRef.current.appendChild(autocomplete);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [onPlaceSelected]);

  return <div ref={inputRef} />;
}

function BookingForm() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [distance, setDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loadingFee, setLoadingFee] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tip, setTip] = useState(0);

  const total = Number(deliveryFee) + Number(tip || 0);

  const triggerDistanceCalculation = async (pickup, delivery) => {
    if (!pickup || !delivery) return;

    setLoadingFee(true);
    try {
      const res = await fetch("https://delivery-u9ub.onrender.com/calculate-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupAddress: pickup, deliveryAddress: delivery }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to calculate fee");

      setDistance(data.distance);
      setDeliveryFee(data.fee);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error calculating fee. Try again.");
      setDistance(null);
      setDeliveryFee(0);
    } finally {
      setLoadingFee(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const phoneRegex = /^(\+233|0)[235][0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const form = e.target;
    const pickupPhone = form.pickupPhone.value;
    const deliveryPhone = form.deliveryPhone.value;
    const email = form.email.value;

    if (!phoneRegex.test(pickupPhone)) {
      alert("Invalid pickup phone number");
      setSubmitting(false);
      return;
    }
    if (!phoneRegex.test(deliveryPhone)) {
      alert("Invalid delivery phone number");
      setSubmitting(false);
      return;
    }
    if (email && !emailRegex.test(email)) {
      alert("Invalid email address");
      setSubmitting(false);
      return;
    }

    const orderData = {
      orderNumber: form.orderNumber.value,
      storeName: form.storeName.value,
      pickupPhone,
      pickupAddress,
      pickupTime: form.pickupTime.value,
      pickupDate: form.pickupDate.value,
      customerName: form.customerName.value,
      deliveryPhone,
      deliveryAddress,
      deliveryDate: form.deliveryDate.value,
      deliveryTime: form.deliveryTime.value,
      itemName: form.itemName.value,
      deliveryFees: deliveryFee,
      tips: tip,
      total,
      instructions: form.instructions?.value || "",
      paymentMethod: form.paymentMethod?.value || "",
      email: email || null,
    };

    try {
      const res = await fetch("https://delivery-u9ub.onrender.com/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        window.location.href = "https://seeyousoondeliveries.com/thank-you";
      } else {
        alert("Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network/server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (<form className="booking-form" onSubmit={handleSubmit}>
      <input type="text" name="orderNumber" placeholder="🔢 Order Number" required className="bold-input" />

      <fieldset>
        <legend>📍 Pick-up From</legend>
        <input type="text" name="storeName" placeholder="🏪 Store Name" required />
        <input type="tel" name="pickupPhone" placeholder="📞 +233..." required />
        <PlaceAutocomplete
          placeholder="Enter pickup location"
          onPlaceSelected={(place) => {
            console.log("Selected place:", place);
            setPickupAddress(place);
            triggerDistanceCalculation(place, deliveryAddress);
          }}
        
        />
        <input type="time" name="pickupTime" defaultValue="11:10" />
        <input type="date" name="pickupDate" defaultValue="2025-05-30" />
      </fieldset>

      <fieldset>
        <legend>🎯 Deliver To</legend>
        <input type="text" name="customerName" placeholder="👤 Customer Name" required />
        <input type="tel" name="deliveryPhone" placeholder="📞 +233..." required />
        <input type="email" name="email" placeholder="✉️ Email (optional)" />
        <PlaceAutocomplete
          placeholder="Enter delivery location"
          onPlaceSelected={(place) => {
            console.log("Selected place:", place);
            setDeliveryAddress(place);
            triggerDistanceCalculation(pickupAddress, place);
          }}
        />
        <input type="date" name="deliveryDate" defaultValue="2025-05-30" />
        <input type="time" name="deliveryTime" defaultValue="11:50" />
      </fieldset>

      <fieldset>
        <legend>🧾 Order Details</legend>
        <input type="text" name="itemName" placeholder="🛒 Item Name" />
        <input type="number" name="deliveryFees" placeholder="🚚 Delivery Fee (₵)" value={deliveryFee} readOnly />
        <input
          type="number"
          name="tips"
          placeholder="🎁 Tip (₵)"
          value={tip}
          min="0"
          onChange={(e) => setTip(e.target.value)}
        />
        <input type="number" name="total" placeholder="💰 Total (₵)" value={total} readOnly />
        <textarea name="instructions" placeholder="📝 Special Instructions"></textarea>
        <select name="paymentMethod" defaultValue="">
          <option value="" disabled>Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="Mobile Money">Mobile Money</option>
        </select>
      </fieldset>

      {loadingFee && <p>Calculating fee…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={submitting || loadingFee}>
        {submitting ? (
          <>
            <span className="spinner" /> Submitting…
          </>
        ) : (
          "Submit Order"
        )}
      </button>
    </form>
  );
}

export default BookingForm;