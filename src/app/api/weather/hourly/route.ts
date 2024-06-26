export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const appid = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;
  const HOURS = 23;

  if (!appid) {
    return Response.json(
      { message: "OpenWeather API key not found in environment variables" },
      { status: 401 }
    );
  }
  if (!lat || !lon) {
    return Response.json({ message: "Missing parameters" }, { status: 400 });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&cnt=${HOURS}&units=metric`;
  const res = await fetch(apiUrl);

  console.log(`Fetching weather data from: ${apiUrl}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return Response.json({ ...data, fetchedAt: new Date().toISOString() });
}
