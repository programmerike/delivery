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
            <b>
              Fast. Reliable delivery across Accra & Tema.
              </b>
            </p>
          <a href="#delivery-form" className="hero-button fancy-button">
            🚚 Book a Delivery
          </a>
        </div>
      </div>
    </section>
  );
}