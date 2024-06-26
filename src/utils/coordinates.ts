export function formatCoordinates(coord: any) {
  return Object.values(coord).reduce((acc: any, curr: any) => {
    acc.push(curr[0]);
    return acc;
  }, []);
}

export function findMeanLocation(coord: any) {
  const allCoordinates = coord.flat();

  let totalLat = 0;
  let totalLon = 0;

  allCoordinates.forEach((coord: any) => {
    totalLat += coord.lat;
    totalLon += coord.lng;
  });

  const meanLat = totalLat / allCoordinates.length;
  const meanLon = totalLon / allCoordinates.length;

  return { lat: meanLat.toString(), lon: meanLon.toString() };
}
