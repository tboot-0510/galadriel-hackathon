// /alerts
// /threats
// /fires
// /droughts/monitor

// /convective/outlook
// /fires/outlook
// /phrases/summary -> forecast in language : "Expect light rain showers starting around 12 PM. Temperatures rising to 28 degrees this afternoon."
// /lightning/threats
// /stormcells/summary -> active stormcells

const forecastEndpointsPrefix = [
  "convective/outlook",
  "fires/outlook",
  "phrases/summary",
  "lightning/threats",
  "stormcells/summary",
];

const dailyEndpointsPrefix = ["alerts", "threats", "fires", "droughts/monitor"];

const actionEndpoints = {
  forecast: forecastEndpointsPrefix,
  current: dailyEndpointsPrefix,
};

const fetchWeatherData = async ({
  endpoint,
  lat,
  lon,
}: {
  endpoint: string;
  lat: string;
  lon: string;
}) => {
  const RADIUS = "10:km";
  const res = await fetch(
    `https://data.api.xweather.com/${endpoint}/${lat},${lon}&client_secret=${process.env.XWEATHER_SECRET}&client_id=${process.env.XWEATHER_CLIENT}&radius=${RADIUS}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data for : ${endpoint}`);
  }

  return await res.json();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const action = searchParams.get("action");

  if (!action || actionEndpoints[action as string]) {
    return Response.json(
      { message: "Missing action type for XWeather API" },
      { status: 401 }
    );
  }

  if (!lat || !lon) {
    return Response.json({ message: "Missing lat param" }, { status: 400 });
  }

  const apiEndpoints = actionEndpoints[action as string] as string[];

  const promises = apiEndpoints.map((endpoint) =>
    fetchWeatherData({ endpoint, lat, lon })
  );

  const results = await Promise.all(promises);

  // format data here
  console.log("results", results);

  return Response.json(results);
}
