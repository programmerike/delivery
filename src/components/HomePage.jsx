import React from "react";
import Hero from "./Hero";
import DeliveryForm from "./DeliveryForm";
import OurServices from "./OurServices";
import AboutUs from "./AboutUs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
        <OurServices />
         <DeliveryForm />
        <section id="book-delivery" style={{ padding: '2rem 0', backgroundColor: '#f9f9f9' }}>
  
  <iframe
    src="https://www.deliveryorderforms.com/orderWithoutUpfrontPay/PZ71YypMdP"  
    title="Book a Delivery with Shipday"
    style={{
      width: '100%',
      height: '800px',
      border: 'none',
      display: 'block',
      margin: '0 auto'
    }}
  />
</section>
     
      
    </>
  );
}