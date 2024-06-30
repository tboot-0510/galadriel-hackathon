import CustomerInfo from "../../components/widgets/CustomerInfo";
import InsurancePremiumChart from "@/components/widgets/InsurancePremiumChart";
import ProtectedRoute from "../../components/ProtectedRoute";
import HourlyForecast from "@/components/widgets/HourlyForecast";
import { HourlyForecastResponse, LandCoord } from "@/lib/types";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getHourlyData } from "@/actions/weather/getHourlyData";
import { getWeatherConditions } from "@/actions/weather/getWeatherConditionsData";
import { findMeanLocation, formatCoordinates } from "@/utils/coordinates";

import "./dashboard.css";
import PremiumInfo from "@/components/widgets/PremiumInfo";
import { estimatePremium, getPremiumFormattedData } from "@/lib/premiums";
import { getSevereWeatherConditions } from "@/actions/weather/getSevereWeatherConditions";
import { getPremiumData, getUser } from "@/actions/user";
import Map from "@/components/widgets/Map";
import SevereForecast from "@/components/widgets/SevereForecast";
import { formatDate, getActualTimeForTimezone, getDaysInMonth } from "@/utils/date";

const getUserCoordinates = async (account:string) => {
  const {landCoordinates} = (await getUser(account))?.user;
  return formatCoordinates(landCoordinates);
}

const DashboardPage = async ({ searchParams }: any) => {
  const account = searchParams?.account;
  
  if (!account) redirect("/");

  const coord = await getUserCoordinates(account);
  
  const { lat, lon } = findMeanLocation(coord);

  const hourlyDataRequest = await getHourlyData({
    lat,
    lon,
  });

  const weatherDataRequest = await getWeatherConditions({ lat, lon });

  const premiumDataRequest = await getPremiumData({account});

  const [hourlyData, weatherData, premiumData] = await Promise.all([
    hourlyDataRequest,
    weatherDataRequest,
    premiumDataRequest
  ]);


  console.log("lat,", lat, lon);

  const chartData = {
    labels: weatherData.daily.time.map(formatDate),
    city: `${hourlyData.city.name},${hourlyData.city.country}`,
    datasets: [
      {
        label: "Temperature (°C)",
        data: Object.values(weatherData.daily.temperature2mMax),
      },
      {
        label: "Precipitation (mm)",
        data: Object.values(weatherData.daily.rainSum),
      },
      {
        label: "Wind Speed (km/h)",
        data: Object.values(weatherData.daily.windSpeed10mMax),
      },
      {
        label: "Soil temp (°C)",
        data: Object.values(weatherData.hourly.soilTemperature7To28cm),
      },
    ],
  };

  

  const user = await getUser(account);

  const formattedPremiumData = getPremiumFormattedData(premiumData, user, chartData);

  console.log("formattedPremiumData", formattedPremiumData);

  const severWeatherDataRequest = await getSevereWeatherConditions({lat, lon, city: chartData.city, premium: formattedPremiumData, action:"forecast"});

  const [severeWeatherData] = await Promise.all([
    severWeatherDataRequest,
  ]);

  const {tx} = severeWeatherData;

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
            premiumInfo={formattedPremiumData}
          />

        </div>
        <section className="flex flex-col w-full h-full gap-4">
          <HourlyForecast data={hourlyData.list} fetchedAt={hourlyData.fetchedAt} />
          <SevereForecast data={severeWeatherData} fetchedAt={severeWeatherData.fetchedAt}/>
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <Map lat={lat} lon={lon}/>
            </div>
            <div className="flex-1">
              <InsurancePremiumChart tx={tx} premiumInfo={formattedPremiumData} chartData={chartData}/>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
