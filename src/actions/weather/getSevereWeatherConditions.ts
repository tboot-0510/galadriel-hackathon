export const getSevereWeatherConditions = async ({
  lat,
  lon,
  action,
}: {
  lat: string;
  lon: string;
  action: string;
}) => {
  const url = `${process.env.VERCEL_URL}/api/weather/severe?lat=${lat}&lon=${lon}&action=${action}`;
  const data = await fetch(url, { next: { revalidate: 3600 } });

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};
