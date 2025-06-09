import React, { useEffect, useRef } from "react";

const PlacesInput = ({ onPlaceSelected }) => {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const input = autocompleteRef.current;

    if (input) {
      input.addEventListener("gmpx-placechange", () => {
        const place = input.value;
        onPlaceSelected(place); // update parent state
      });
    }
  }, []);

  return (
    <gmpx-place-autocomplete
      ref={autocompleteRef}
      style={{ width: "100%", height: "40px", padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
    ></gmpx-place-autocomplete>
  );
};

export default PlacesInput;