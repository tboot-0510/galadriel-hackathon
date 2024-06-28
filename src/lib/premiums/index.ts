function calculateAverage(arr) {
  return arr?.reduce((a, b) => a + b, 0) / arr?.length;
}

function calculateStandardDeviation(arr) {
  const avg = calculateAverage(arr);
  const squareDiffs = arr?.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

export function estimatePremium(data) {
  const weights = {
    "Soil temp (°C)": 0.1,
    "Wind Speed (km/h)": 0.2,
    "Precipitation (mm)": 0.4,
    "Temperature (°C)": 0.3,
  };

  const basePremium = 100;

  let riskScore = 0;

  for (const category in data) {
    const average = calculateAverage(data[category].data);
    const stddev = calculateStandardDeviation(data[category].data);

    const categoryRisk = (average + stddev) * weights[data[category].label];
    riskScore += categoryRisk;
  }

  const estimatedPremium = basePremium + riskScore;

  return estimatedPremium;
}
