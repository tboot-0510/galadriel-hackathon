import CustomerInfo from "../../components/widgets/CustomerInfo";
import InsurancePremiumChart from "@/components/widgets/InsurancePremiumChart";
import ProtectedRoute from "../../components/ProtectedRoute";
import "./dashboard.css";
import HourlyForecast from "@/components/widgets/HourlyForecast";
import { HourlyForecastResponse } from "@/lib/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchWeatherApi } from "openmeteo";
import CurrentWeather from "@/components/widgets/CurrentWeather";
import { getOneYearBefore } from "@/utils/date";
import { useWeatherData } from "@/context/WeatherProvider";

const getHourlyData = async ({ lat, lon }: { lat: string; lon: string }) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=30&units=metric&appid=529ea9fdb4327438ce135753d33f28c8`;
  const url = `${process.env.VERCEL_URL}/api/weather/hourly?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`;
  const data = await fetch(apiUrl);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

const getYearlyData = async ({ lat, lon }: { lat: string; lon: string }) => {
  const apiUrl = `https://data.api.xweather.com/conditions/summary/${lat},${lon}?format=json&client_id=CUWC0ZVzrv2G0UO4P0Sjq&client_secret=0uJ0NHwUJGv8aMdXy32rL0D30JmX1st2BvP7imbC`;

  const data = await fetch(apiUrl);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

const getPast2DaysData = async ({}) => {
  let apiUrl = "https://api.ambeedata.com/weather/history/by-lat-lng";

  let options = {
    method: "GET",
    qs: {
      lat: "12.9889055",
      lng: "77.574044",
      from: "2020-07-13 12:16:44",
      to: "2020-07-14 12:16:44",
    },
    headers: {
      "x-api-key": process.env.AMBEE_API_KEY,
      "Content-type": "application/json",
    },
  };

  const data = await fetch(apiUrl, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

const getWeatherConditions = async ({
  lat,
  lon,
}: {
  lat: string;
  lon: string;
}) => {
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

  return weatherData;
};

function formatCoordinates(coord: any) {
  return Object.values(coord).reduce((acc: any, curr: any) => {
    acc.push(curr[0]);
    return acc;
  }, []);
}

function findMeanLocation(coord: any) {
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

const DashboardPage = async ({ params, searchParams }: any) => {
  const coord = searchParams?.coordinates;
  const parsedCoordinates = formatCoordinates(JSON.parse(coord));
  const { lat, lon } = findMeanLocation(parsedCoordinates);

  const HourlyDataRequest: HourlyForecastResponse = await getHourlyData({
    lat,
    lon,
  });

  const YearlyDataRequest: YearlyForecastResponse = await getYearlyData({
    lat,
    lon,
  });

  const weatherDataRequest = await getWeatherConditions({ lat, lon });

  const [hourlyData, weatherData] = await Promise.all([
    HourlyDataRequest,
    weatherDataRequest,
  ]);

  console.log("lat, lon", lat, lon);

  if (!hourlyData) return notFound();
  if (!weatherData) return notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full min-w-[18rem] flex-col gap-4 md:w-1/2">
          <CustomerInfo
            data={hourlyData.list[0]}
            city={hourlyData.city}
            coordinates={parsedCoordinates}
          />
        </div>
        <section className="flex flex-col w-full h-full gap-4">
          <HourlyForecast data={hourlyData.list} />
          <InsurancePremiumChart data={weatherData} />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
