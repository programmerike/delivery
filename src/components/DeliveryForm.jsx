import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

function DeliveryForm() {
  const [formData, setFormData] = useState({
    orderNumber: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    storeTime: '11:10',
    storeDate: '2025-05-30',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryDate: '2025-05-30',
    deliveryTime: '11:50',
    itemName: '',
    deliveryFee: '',
    tips: '',
    total: '',
    instructions: '',
    paymentMethod: '',
  });

  const navigate = useNavigate();

  const storeAutocompleteRef = useRef(null);
  const deliveryAutocompleteRef = useRef(null);

  const handlePlaceChanged = (type) => {
    let place;
    if (type === 'store' && storeAutocompleteRef.current) {
      place = storeAutocompleteRef.current.getPlace();
    } else if (type === 'delivery' && deliveryAutocompleteRef.current) {
      place = deliveryAutocompleteRef.current.getPlace();
    } else {
      return;
    }

    if (place && place.formatted_address) {
      setFormData((prev) => ({
        ...prev,
        ...(type === 'store'
          ? { storeAddress: place.formatted_address }
          : { deliveryAddress: place.formatted_address }),
      }));
    }
  };

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ['deliveryFee', 'tips', 'total'].includes(name) &&
      value !== '' &&
      isNaN(Number(value))
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    const deliveryFeeNum = Number(formData.deliveryFee) || 0;
    const tipsNum = Number(formData.tips) || 0;
    const totalAmount = deliveryFeeNum + tipsNum;
    setFormData((prev) => ({ ...prev, total: totalAmount.toString() }));
  };

  useEffect(() => {
    calculateTotal();
  }, [formData.deliveryFee, formData.tips]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Add backend/Shipday submission here

    navigate('/thank-you');
  };

  return (
    <div>
      {/* Your full form JSX here, exactly as you wrote it */}
      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Who We Are 💡</h2>
          <p>
            <b>
              SeeYouSoon Courier brings joy to your doorstep! We offer super-speedy same-day
              delivery of your favorite food, retail items, and essentials in Accra & Tema 🚴‍♂️.
            </b>
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>✨ Our Delightful Services</h2>
        <div className="service-cards">
          {[
            { label: 'Food Delivery', src: '/images/food-delivery.png' },
            { label: 'Retail Goods', src: '/images/retail-goods.png' },
            { label: 'Medication', src: '/images/medication.png' },
            { label: 'Personal Packages', src: '/images/personal-packages.png' },
          ].map((service, idx) => (
            <div className="card" key={idx}>
              <img src={service.src} alt={service.label} />
              <div>{service.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section" id="booking">
        <div className="order-container">
          <h2>Let's Make a Delivery!</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_redirect"
              value="https://seeyousoondeliveries.com/thank-you"
            />

            <input
              type="text"
              name="orderNumber"
              placeholder="🔢 Order Number"
              required
              className="bold-input"
              value={formData.orderNumber}
              onChange={handleChange}
            />

            <fieldset>
              <legend>📍 Pick-up From</legend>
              <input
                type="text"
                name="storeName"
                placeholder="🏪 Store Name"
                required
                value={formData.storeName}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="storePhone"
                placeholder="📞 +233 (000) 000-00-00"
                required
                value={formData.storePhone}
                onChange={handleChange}
              />
              <Autocomplete
                onLoad={(auto) => (storeAutocompleteRef.current = auto)}
                onPlaceChanged={() => handlePlaceChanged('store')}
                options={{
                  types: ['geocode'],
                  componentRestrictions: { country: 'gh' },
                }}
              >
                <input
                  type="text"
                  name="storeAddress"
                  placeholder="📍 Store Address"
                  required
                  value={formData.storeAddress}
                  onChange={handleChange}
                />
              </Autocomplete>
              <input
                type="time"
                name="storeTime"
                value={formData.storeTime}
                onChange={handleChange}
                placeholder="optional"
              />
              <input
                type="date"
                name="storeDate"
                value={formData.storeDate}
                onChange={handleChange}
                placeholder="optional"
              />
            </fieldset>

            <fieldset>
              <legend>🎯 Deliver To</legend>
              <input
                type="text"
                name="customerName"
                placeholder="👤 Customer Name"
                required
                value={formData.customerName}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="customerPhone"
                placeholder="📞 +233 (000) 000-00-00"
                required
                value={formData.customerPhone}
                onChange={handleChange}
              />
              <input
                type="email"
                name="customerEmail"
                placeholder="✉️ Email Address optional"
                value={formData.customerEmail}
                onChange={handleChange}
              />
              <Autocomplete
                onLoad={(auto) => (deliveryAutocompleteRef.current = auto)}
                onPlaceChanged={() => handlePlaceChanged('delivery')}
                options={{
                  types: ['geocode'],
                  componentRestrictions: { country: 'gh' },
                }}
              >
                <input
                  type="text"
                  name="deliveryAddress"
                  placeholder="📍 Delivery Address"
                  required
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                />
              </Autocomplete>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                placeholder="optional"
              />
              <input
                type="time"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                placeholder="optional"
              />
            </fieldset>

            <fieldset>
              <legend>🧾 Order Details</legend>
              <input
                type="text"
                name="itemName"
                placeholder="🛒 Item Name"
                value={formData.itemName}
                onChange={handleChange}
              />
              <input
                type="number"
                name="deliveryFee"
                placeholder="🚚 Delivery Fees (₵)"
                min="0"
                value={formData.deliveryFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="tips"
                placeholder="🎁 Tips (₵)"
                min="0"
                value={formData.tips}
                onChange={handleChange}
              />
              <input
                type="number"
                name="total"
                placeholder="💵 Total (₵)"
                readOnly
                value={formData.total}
              />
            </fieldset>

            <textarea
              name="instructions"
              placeholder="🗒️ Any fun delivery instructions?"
              rows={3}
              value={formData.instructions}
              onChange={handleChange}
            />

            <select
              name="paymentMethod"
              required
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">💳 Choose a Payment Method</option>
              <option value="cash">💵 Cash on Delivery</option>
              <option value="momo">📱 Mobile Money</option>
              <option value="card">💳 Credit/Debit Card</option>
            </select>

            <button type="submit">🎉 Submit Order</button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>📬 Contact Us</h2>
        <p>
          Email:{' '}
          <a href="mailto:seeyousoon.delivery@gmail.com">seeyousoon.deliveries@gmail.com</a>
        </p>
        <p>
          Phone: <a href="tel:+233533846238"> +233 53 384 6238 </a>
        </p>
        <p>
          <a href="tel:+233531448173">+233 53 144 8173</a>
        </p>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>🗺️ We Deliver In:</h2>
        <iframe
          title="Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126917.96664707348!2d-0.26272953441869345!3d5.614818856901056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfe2a5490bfc5bb9%3A0x5f9e7f7e8e8e8e8e!2sAccra!5e0!3m2!1sen!2sgh!4v1717079468473"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '8px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}

export default DeliveryForm;
