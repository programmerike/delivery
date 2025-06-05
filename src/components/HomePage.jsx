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
    </>
  );
}