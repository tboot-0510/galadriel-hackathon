// /alerts // filter=outlook update time real-time
// /threats // update near real time -> periods.storms : {}
// /fires // real time
// /droughts/monitor // https://data.api.xweather.com/droughts/monitor/contains?p=44.13495767829996, -103.22479304962965&filter=all

import { formatFireOutlook } from "@/lib/formatters/severe/fire";
import { formatConvectiveOutlook } from "@/lib/formatters/severe/outlook";
import { formatStormCellSummary } from "@/lib/formatters/severe/storm";
import { formatPhrasesSummary } from "@/lib/formatters/severe/summary";

// /convective/outlook (time range +8 days) https://data.api.xweather.com/convective/outlook/contains?p=44.13495767829996,-103.22479304962965&filter=all&from=today&to=+7days&sort=day
// /fires/outlook filter=all&from=today&to=+7days&sort=day&
// /phrases/summary -> forecast (6hours) in language : "Expect light rain showers starting around 12 PM. Temperatures rising to 28 degrees this afternoon."
// /lightning/threats // updated Every 2 minutes - time range +1 hour (10 times multiplier)
// /stormcells/summary -> active stormcells (updated Every 2 - 3 Minutes) filter=threat

const options = {
  "convective/outlook": "&filter=all&from=today&to=+7days&sort=day",
  "fires/outlook": "&filter=all&from=today&to=+7days&sort=day&",
  "phrases/summary": "",
  "lightning/threats": "",
  "stormcells/summary": "",
  alerts: "&filter=outlook",
  fires: "&filter=outlook",
  threats: "",
  "droughts/monitor": "&filter=all",
};

const actionEndpoints = {
  forecast: [
    "convective/outlook",
    "fires/outlook",
    "phrases/summary",
    // "lightning/threats",
    "stormcells/summary",
  ],
  current: ["alerts", "threats", "fires", "droughts/monitor"],
};

const getFormatFunc = {
  "convective/outlook": formatConvectiveOutlook,
  "fires/outlook": formatFireOutlook,
  "phrases/summary": formatPhrasesSummary,
  "stormcells/summary": formatStormCellSummary,
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
  const option = options[endpoint as string];
  const res = await fetch(
    `https://data.api.xweather.com/${endpoint}/${lat},${lon}?client_secret=${process.env.XWEATHER_SECRET}&client_id=${process.env.XWEATHER_CLIENT}&radius=${RADIUS}${option}`
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
      acc.push({ success, endpoint: curr.endpoint, response: [] });
      return acc;
    }
    if (error && error.code === "warn_no_data") {
      acc.push({ success, endpoint: curr.endpoint, response: [] });
      return acc;
    }

    const formatterFunc = getFormatFunc[curr.endpoint];
    const resp = formatterFunc(response);

    acc.push({ success, endpoint: curr.endpoint, response: resp });

    return acc;
  }, []);

  return Response.json({
    results: formattedResults,
    fetchedAt: new Date().toISOString(),
  });
}
