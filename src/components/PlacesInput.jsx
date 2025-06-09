// PlacesInput.jsx
import React, { useEffect, useRef } from 'react';

const PlacesInput = ({ label, onPlaceSelected }) => {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'gh' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onPlaceSelected(place.formatted_address);
      }
    });
  }, []);

  return (
    <div className="place-autocomplete-group">
      <label>{label}</label>
      <input
        ref={autocompleteRef}
        className="place-autocomplete-wrapper"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
};

export default PlacesInput;