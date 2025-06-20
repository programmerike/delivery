import React from "react";
import "./OurServices.css";
import FoodImg from "/src/assets/food.png";
import RetailImg from "/src/assets/retail.png";
import MedicationImg from "/src/assets/meds.png";
import PersonalImg from "/src/assets/personal.png"; // NEW

export default function OurServices() {
   const services = [
    { title: "Food Delivery", image: FoodImg },
    { title: "Medication Delivery", image: MedicationImg },
    { title: "Retail Goods", image: RetailImg },
    { title: "Personal Items", image: PersonalImg },

   ];
  return (
    <section className="services-section" id="our-services"
      style={{ padding: "4rem 2rem", background: "#fff", textAlign: "center" }}>
      <h1>
        <i>
          📦 Our Services
        </i>
          </h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <img src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};