import { useEffect, useRef } from 'react';

const PlaceAutocompleteInput = ({ placeholder = "Enter an address", onPlaceSelect }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places?.PlaceAutocompleteElement && containerRef.current) {
        clearInterval(interval);

        const autocompleteEl = new window.google.maps.places.PlaceAutocompleteElement();
        autocompleteEl.setAttribute("placeholder", placeholder);

        autocompleteEl.addEventListener("place_changed", () => {
          const place = autocompleteEl.getPlace();
          if (onPlaceSelect) {
            onPlaceSelect(place);
          }
        });

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(autocompleteEl);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [placeholder, onPlaceSelect]);

  return <div ref={containerRef} />;
};

export default PlaceAutocompleteInput;