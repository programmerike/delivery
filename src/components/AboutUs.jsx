import React from "react";
import "../styles/AboutUs.css"; 

export default function AboutUs() {
  return (
    <section className="about-us" id="about-us"
      style={{ padding: "4rem 2rem", background: "#f9f9f9", textAlign: "center" }}>
      <div className="about-us-container">
        <h2>About Us</h2>
        <p>
          <b>
          SeeYouSoon offers hyperlocal delivery services for individuals and small businesses who need fast,
dependable courier options. The service operates primarily via motorcycle, enabling quick navigation through
traffic-heavy areas of Accra and Tema. SeeYouSoon is founded on the principle that people want their items
now, not later-and that convenience should never come at a high price.
        </b>
        </p>
      </div>
    </section>
  );
}