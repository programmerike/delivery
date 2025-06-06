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
            type="button" className="animated-submit" style={{ marginTop: "1rem" }}
              onClick={() => {
                const form = document.getElementById("delivery-form");
                if (form) {
                  form.scrollIntoView({ behavior: "smooth" });
                }
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
