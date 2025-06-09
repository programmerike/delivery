// src/components/AddressInput.jsx
import { useEffect } from "react";

const AddressInput = ({ id, label, onPlaceSelect }) => {
  useEffect(() => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("gmpx-placeautocomplete-placechange", (e) => {
        const selectedValue = e.target.value;
        onPlaceSelect(selectedValue);
      });
    }
  }, [id, onPlaceSelect]);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label htmlFor={id} style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <gmpx-placeautocomplete
        id={id}
        placeholder={`Enter ${label.toLowerCase()}`}
        style={{
          width: "100%",
          height: "40px",
          fontSize: "16px",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      ></gmpx-placeautocomplete>
    </div>
  );
};

export default AddressInput;