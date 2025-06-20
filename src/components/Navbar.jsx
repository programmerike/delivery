// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("hero");

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
      setActiveLink(id);
    }
  };

  useEffect(() => {
  const sectionIds = ["home", "about-us", "our-services", "book-delivery", "contact-us"];

  const handleScroll = () => {
    let found = false;

    for (let id of sectionIds) {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveLink(id);
          found = true;
          break;
        }
      }
    }

    // Fallback: if at bottom, force contact-us active
    if (!found && window.innerHeight + window.scrollY >= document.body.scrollHeight - 10) {
      setActiveLink("contact-us");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // run once on mount

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <div className="navbar-logo">QuickDrop</div>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <a className={activeLink === "home" ? "active" : ""} onClick={() => scrollTo("home")}>
            Home
          </a>
          <a className={activeLink === "about-us" ? "active" : ""} onClick={() => scrollTo("about-us")}>
            About Us
          </a>
          <a className={activeLink === "our-services" ? "active" : ""} onClick={() => scrollTo("our-services")}>
            Services
          </a>
          <a className={activeLink === "contact-us" ? "active" : ""} onClick={() => scrollTo("delivery-form")}>
            Contact Us
          </a>
          <a className={activeLink === "book-delivery" ? "active" : ""} onClick={() => scrollTo("book-delivery")}>
            Book
          </a>
        </nav>

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
}