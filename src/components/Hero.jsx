import React from "react";
import "./Hero.css";
import Background from "../assets/background.jpg"; // Adjust path if needed

export default function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="hero-overlay">
        <div className="hero-card">
          <h1>Welcome To SeeYouSoon Deliveries</h1>
          <p>
            <b>Fast. Reliable delivery across Accra & Tema.</b>
          </p>

          <div className="fancy-button">
            <button
  onClick={() => {
    const formSection = document.getElementById('book-delivery');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }}
  style={{
    padding: '12px 24px',
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  }}
>
  Book a Delivery
</button>
          </div>
        </div>
      </div>
    </section>
  );
}