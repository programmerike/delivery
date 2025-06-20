import React from "react";

function Contact() {
  return (
    <section className="contact-section" id="contact-us"
      style={{ background: "#fff8f2", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", 
        minHeight: "80vh", padding: "3rem 2rem"
      }}>
        <h2>📬 Contact Us</h2>
        <p>Email: <a href="mailto:seeyousoon.deliveries@gmail.com">seeyousoon.deliveries@gmail.com</a></p>
        <p>
          Phone: <a href="tel:+233533846238">+233 53 384 6238</a><br />
          <a href="tel:+233531448173">+233 53 144 8173</a>
        </p>
      </section>
  );
}

export default Contact;