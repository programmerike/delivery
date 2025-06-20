import React from "react";
import "./Hero.css";
import Background from "../assets/background.jpg"; 

export default function Hero() {
  return (
    <section
      className="hero" id="home"
      style={{
        minHeight: "100vh", paddingTop: "80px",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
                const formSection = document.getElementById("book-delivery");
                if (formSection) {
                  formSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="pulsing-button"
              style={{
                padding: "12px 24px",
                backgroundColor: "#ff5722",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
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