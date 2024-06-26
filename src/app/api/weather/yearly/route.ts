export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return Response.json({ message: "Missing parameters" }, { status: 400 });
  }

  const apiUrl = `https://data.api.xweather.com/conditions/summary/${lat},${lon}?format=json&client_id=${process.env.XWEATHER_CLIENT}&client_secret=${process.env.XWEATHER_SECRET}`;
  const res = await fetch(apiUrl);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return Response.json(data);
}
