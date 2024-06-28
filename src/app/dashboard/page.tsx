import CustomerInfo from "../../components/widgets/CustomerInfo";
import InsurancePremiumChart from "@/components/widgets/InsurancePremiumChart";
import ProtectedRoute from "../../components/ProtectedRoute";
import HourlyForecast from "@/components/widgets/HourlyForecast";
import { HourlyForecastResponse } from "@/lib/types";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getHourlyData } from "@/actions/weather/getHourlyData";
import { getWeatherConditions } from "@/actions/weather/getWeatherConditionsData";
import { findMeanLocation, formatCoordinates } from "@/utils/coordinates";

import "./dashboard.css";
import PremiumInfo from "@/components/widgets/PremiumInfo";
import { estimatePremium } from "@/lib/premiums";
import { getSevereWeatherConditions } from "@/actions/weather/getSevereWeatherConditions";
import { getUser } from "@/actions/user";
import Map from "@/components/widgets/Map";
import SevereForecast from "@/components/widgets/SevereForecast";

const getUserCoordinates = async (account:string) => {
  const {landCoordinates} = (await getUser(account))?.user;
  return formatCoordinates(landCoordinates);
}

const DashboardPage = async ({ searchParams }: any) => {
  const account = searchParams?.account;
  
  if (!account) redirect("/");

  const coord = await getUserCoordinates(account);
  
  const { lat, lon } = findMeanLocation(coord);

  const HourlyDataRequest: HourlyForecastResponse = await getHourlyData({
    lat,
    lon,
  });

  const weatherDataRequest = await getWeatherConditions({ lat, lon });

  const severWeatherDataRequest = await getSevereWeatherConditions({lat, lon, action:"forecast"});

  const [hourlyData, weatherData, severeWeatherData] = await Promise.all([
    HourlyDataRequest,
    weatherDataRequest,
    severWeatherDataRequest
  ]);

  console.log("lat, lon", lat, lon);

  if (!hourlyData) return notFound();
  if (!weatherData) return notFound();
  if (!severeWeatherData) return notFound();

  const chartData = {
    datasets: [
      {
        label: "Temperature (°C)",
        data: Object.values(weatherData.daily.temperature2mMax),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y1",
      },
      {
        label: "Precipitation (mm)",
        data: Object.values(weatherData.daily.rainSum),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y2",
      },
      {
        label: "Wind Speed (km/h)",
        data: Object.values(weatherData.daily.windSpeed10mMax),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y3",
      },
      {
        label: "Soil temp (°C)",
        data: Object.values(weatherData.hourly.soilTemperature7To28cm),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y4",
      },
    ],
  };

  const estimatedPremium = estimatePremium(chartData.datasets)

  return (
    <div className="flex flex-col items-center justify-between px-24 h-full">
      <div className="flex flex-col gap-4 md:flex-row w-full h-full">
        <div className="flex w-full h-full min-w-[18rem] flex-col gap-4 md:w-[12rem]">
          <CustomerInfo
            data={hourlyData.list[0]}
            city={hourlyData.city}
            coordinates={coord}
          />
          <PremiumInfo
            estimate={estimatedPremium}
          />

        </div>
        <section className="flex flex-col w-full h-full gap-4">
          <HourlyForecast data={hourlyData.list} />
          <SevereForecast data={severeWeatherData} />
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <Map lat={lat} lon={lon}/>
            </div>
            <div className="flex-1">
              <InsurancePremiumChart data={weatherData} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
