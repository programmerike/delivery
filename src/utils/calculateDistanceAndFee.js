export default function calculateDistanceAndFee(distance) {
  const roundedDistance = Math.round(distance * 10) / 10;

  let fee = 0;

  if (distance <= 3) {
    fee = 18;
  } else if (distance <= 4.5) {
    fee = 22;
  } else {
    const extraDistance = distance - 4.5;
    const extraUnits = Math.ceil(extraDistance / 2);
    fee = 22 + extraUnits * 4;
  }

  return {
    distance: roundedDistance,
    fee,
  };
}