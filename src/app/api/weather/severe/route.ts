// /alerts // filter=outlook update time real-time
// /threats // update near real time -> periods.storms : {}
// /fires // real time
// /droughts/monitor // https://data.api.xweather.com/droughts/monitor/contains?p=44.13495767829996, -103.22479304962965&filter=all

// /convective/outlook (time range +8 days) https://data.api.xweather.com/convective/outlook/contains?p=44.13495767829996,-103.22479304962965&filter=all&from=today&to=+7days&sort=day
// /fires/outlook filter=all&from=today&to=+7days&sort=day&
// /phrases/summary -> forecast (6hours) in language : "Expect light rain showers starting around 12 PM. Temperatures rising to 28 degrees this afternoon."
// /lightning/threats // updated Every 2 minutes - time range +1 hour (10 times multiplier)
// /stormcells/summary -> active stormcells (updated Every 2 - 3 Minutes) filter=threat

const forecastEndpointsPrefix = [
  "convective/outlook",
  "fires/outlook",
  "phrases/summary",
  // "lightning/threats",
  "stormcells/summary",
];

const keyToExtract = {
  "convective/outlook": [],
  "fires/outlook": [],
  "phrases/summary": ["phrases.longMET"],
  "lightning/threats": [],
  "stormcells/summary": [],
};

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
    `https://data.api.xweather.com/${endpoint}/${lat},${lon}?client_secret=${process.env.XWEATHER_SECRET}&client_id=${process.env.XWEATHER_CLIENT}&radius=${RADIUS}`
  );

  if (!res.ok) {
    console.warn(`Failed to fetch data for : ${endpoint}`);
    return {};
  }

  const data = await res.json();

  if (!data.success) {
    console.warn(`Endpoint: ${endpoint} returned no data. Response:`, data);
  }

  return data;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const action = searchParams.get("action");
  if (!action || !actionEndpoints[action as string]) {
    return Response.json(
      { message: "Missing action type for XWeather API" },
      { status: 401 }
    );
  }

  if (!lat || !lon) {
    return Response.json({ message: "Missing lat param" }, { status: 400 });
  }

  const apiEndpoints = actionEndpoints[action as string] as string[];
  const promises = apiEndpoints.map(async (endpoint) => {
    const response = await fetchWeatherData({ endpoint, lat, lon });
    return { endpoint, response };
  });

  const results = await Promise.all(promises);

  const formattedResults = results.reduce((acc, curr) => {
    const { success, error, response } = curr.response;
    if (!success) {
      acc.push({ endpoint: curr.endpoint, response: [] });
      return acc;
    }
    if (error && error.code === "warn_no_data") {
      acc.push({ endpoint: curr.endpoint, response: [] });
      return acc;
    }

    acc.push({ endpoint: curr.endpoint, response: response });

    return acc;
  }, []);

  return Response.json(formattedResults);
}
