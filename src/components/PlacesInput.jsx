import React, { useEffect, useRef } from 'react';

const PlacesInput = ({ label, onPlaceSelected }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePlaceSelect = (event) => {
      const place = event.detail;
      if (place && place.formattedAddress) {
        onPlaceSelected(place.formattedAddress);
      }
    };

    const element = containerRef.current?.querySelector('gmpx-place-autocomplete');
    if (element) {
      element.addEventListener('gmpx-placeautocomplete-placechange', handlePlaceSelect);
    }

    return () => {
      if (element) {
        element.removeEventListener('gmpx-placeautocomplete-placechange', handlePlaceSelect);
      }
    };
  }, []);

  return (
    <div className="place-autocomplete-group">
      <label>{label}</label>
      <div ref={containerRef}>
        <gmpx-place-autocomplete
          style={{ width: '100%' }}
          placeholder={`Enter ${label.toLowerCase()}`}
          input-class-name="place-autocomplete-wrapper"
          hide-logos
        ></gmpx-place-autocomplete>
      </div>
    </div>
  );
};

export default PlacesInput;