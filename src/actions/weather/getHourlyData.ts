export const getHourlyData = async ({
  lat,
  lon,
}: {
  lat: string;
  lon: string;
}) => {
  const url = `${process.env.VERCEL_URL}/api/weather/hourly?lat=${lat}&lon=${lon}`;
  const data = await fetch(url, {
    cache: "no-cache",
    next: { revalidate: 3600 },
  });

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};
