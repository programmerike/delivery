document.getElementById('deliveryForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;
  const item = document.getElementById('item').value;
  const notes = document.getElementById('notes').value;

  // For now, just show a confirmation message
  document.getElementById('message').innerHTML = `
    <p style="color: green;">Delivery request submitted!<br>
    Pickup: ${pickup}<br>
    Drop-off: ${dropoff}</p>
  `;

  // Clear the form
  document.getElementById('deliveryForm').reset();
});
