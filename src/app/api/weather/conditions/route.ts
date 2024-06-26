import { getOneYearBefore } from "@/utils/date";
import { fetchWeatherApi } from "openmeteo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const params = {
    latitude: lat,
    longitude: lon,
    start_date: getOneYearBefore(new Date()),
    end_date: new Date().toISOString().split("T")[0],
    hourly: ["soil_temperature_7_to_28cm", "soil_temperature_28_to_100cm"],
    daily: ["temperature_2m_max", "rain_sum", "wind_speed_10m_max"],
  };
  const url = "https://archive-api.open-meteo.com/v1/archive";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const utcOffsetSeconds = response.utcOffsetSeconds();

  const hourly = response.hourly()!;
  const daily = response.daily()!;
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      soilTemperature7To28cm: hourly.variables(0)!.valuesArray()!,
      soilTemperature28To100cm: hourly.variables(1)!.valuesArray()!,
    },
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      rainSum: daily.variables(1)!.valuesArray()!,
      windSpeed10mMax: daily.variables(2)!.valuesArray()!,
    },
  };

  return Response.json(weatherData);
}
