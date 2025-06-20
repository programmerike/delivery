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
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [distance, setDistance] = useState("5.0"); // mock distance for now

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
    setDistance((distanceFactor + 3).toFixed(1)); // dummy example distance
  };

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        if (!window.google) return;

        pickupAutocompleteRef.current = new google.maps.places.Autocomplete(
          pickupInputRef.current,
          { componentRestrictions: { country: "gh" } }
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
          { componentRestrictions: { country: "gh" } }
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

    navigate("/thank-you", {
      state: {
        orderNumber,
        pickupAddress,
        deliveryAddress,
        distance,
        deliveryFee: fee,
        tip,
        total,
        pickupCode,
        deliveryCode,
        customerName,
        customerPhone,
        customerEmail,
      },
    });
  };

  return (
    <form id="delivery-form" style={{ minHeight: "80vh", padding: "3rem 2rem" }} onSubmit={handleSubmit}>
      
      <div className="contact-section"> 
     <h2><i>
            Contact Us
            </i></h2>
          <p>📍 <strong>Address:</strong> 4 St Adom, Community 22, Tema</p>
<p>📞 <strong>Phone:</strong>{" "}
  <a href="tel:+233533846238" style={{ color: "#007bff", textDecoration: "none" }}>+233 53 384 6238</a> /{" "}
  <a href="tel:+233531448173" style={{ color: "#007bff", textDecoration: "none" }}>+233 53 144 8173</a>
</p>
<p>✉️ <strong>Email:</strong>{" "}
  <a href="mailto:seeyousoon.deliveries@gmail.com" style={{ color: "#007bff", textDecoration: "none" }}>
    seeyousoon.deliveries@gmail.com
  </a>
</p>



    <h4 style={{ marginTop: "1rem" }}>📍 We deliver in:</h4>
    <p>Accra, Tema, Spintex, Airport, East Legon, and nearby areas</p>

    <div style={{ marginTop: "1rem" }} >
      <iframe
        title="Delivery Area Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126912.71618428967!2d-0.31089429720493045!3d5.614818800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b3e2a7b40a5%3A0xbed02d7e99f2f6f6!2sAccra!5e0!3m2!1sen!2sgh!4v1717670400000!5m2!1sen!2sgh"
        width="100%"
        height="300"
        style={{ border: "0", borderRadius: "12px", maxWidth: "600px" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      </div>
    </div>
    </form>
  );
}