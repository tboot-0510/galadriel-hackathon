import CustomerInfo from "../../components/widgets/CustomerInfo";
import InsurancePremiumChart from "@/components/widgets/InsurancePremiumChart";
import ProtectedRoute from "../../components/ProtectedRoute";
import HourlyForecast from "@/components/widgets/HourlyForecast";
import { HourlyForecastResponse } from "@/lib/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { getHourlyData } from "@/actions/weather/getHourlyData";
import { getWeatherConditions } from "@/actions/weather/getWeatherConditionsData";
import { findMeanLocation, formatCoordinates } from "@/utils/coordinates";

import "./dashboard.css";



const DashboardPage = async ({ searchParams }: any) => {
  const coord = searchParams?.coordinates;
  const parsedCoordinates = formatCoordinates(JSON.parse(coord));
  const { lat, lon } = findMeanLocation(parsedCoordinates);

  const HourlyDataRequest: HourlyForecastResponse = await getHourlyData({
    lat,
    lon,
  });

  const weatherDataRequest = await getWeatherConditions({ lat, lon });

  const [hourlyData, weatherData] = await Promise.all([
    HourlyDataRequest,
    weatherDataRequest,
  ]);

  // const user = await prisma.user.findFirst({
  //     where: {
  //       address: "0x02Be16B98D1ed5F3cccA1dd0f202231E75aEb829"
  //     }
  //   })

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
