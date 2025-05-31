// src/components/Contact.jsx
function Contact() {
  return (
    <section className="contact">
      <h2>Book a Delivery</h2>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="text" placeholder="Pickup Address" required />
        <input type="text" placeholder="Delivery Address" required />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default Contact;
