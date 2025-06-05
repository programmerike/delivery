app.post("/calculate-fee", async (req, res) => {
  const { pickupAddress, deliveryAddress } = req.body;
  console.log("Received addresses:", pickupAddress, deliveryAddress);

  try {
    // 🔧 Step 1: Format addresses to improve match accuracy
    const formattedPickup = `${pickupAddress}, Ghana`;
    const formattedDelivery = `${deliveryAddress}, Ghana`;

    // 🌍 Step 2: Call Google Distance Matrix API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
        formattedPickup
      )}&destinations=${encodeURIComponent(
        formattedDelivery
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    console.log("Google API Response:", data);

    // ✅ Step 3: Extract and use the distance
    if (
      data.status === "OK" &&
      data.rows[0].elements[0].status === "OK"
    ) {
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInKm = distanceInMeters / 1000;

      // 💵 Fee logic
      let fee;
      if (distanceInKm <= 3) {
        fee = 18;
      } else if (distanceInKm <= 4.5) {
        fee = 22;
      } else {
        fee = 22 + Math.ceil((distanceInKm - 4.5) / 2) * 4;
      }

      return res.json({ fee, distance: distanceInKm.toFixed(2) });
    } else {
      return res.status(400).json({ error: "Unable to calculate distance from Google API." });
    }
  } catch (error) {
    console.error("Error calculating fee:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});