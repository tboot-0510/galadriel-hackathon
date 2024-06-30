"use client";

import { HourlyForecastData } from "@/lib/types";
import IconComponent from "../ui/IconComponent";
import { timeAgo } from "@/utils/date";

export default function HourlyForecast({ data, fetchedAt }: any) {
  function extractHoursFromDate(dt: number): string {
    const date = new Date(dt * 1000);
    return date.getHours() + "h";
  }

  if (!data) return <></>;

  return (
    <>
    <div
      className="flex flex-col p-6 ring-offset-background transition-colors"
      style={{ height: "11rem", border: "1px solid white", borderRadius: "25px", backgroundColor: "white" }}
    >
      <p className="flex justify-end text-gray-500 text-sm mb-1">fetched {timeAgo(fetchedAt)}</p>
      <div className="col-span-2 flex cursor-grab touch-auto touch-pan-x select-none scroll-px-0.5 flex-row items-center justify-between gap-12 overflow-hidden overscroll-contain scroll-smooth px-6 h-full ring-offset-background transition-colors scrollbar-hide hover:overflow-x-auto focus:scroll-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {data.slice(0, 12).map((item: HourlyForecastData, i: number) => (
          <div key={item.dt} className="flex h-full flex-col justify-between">
            <div className="flex justify-center text-sm text-neutral-600 dark:text-neutral-400">
              {i === 0 ? "Now" : extractHoursFromDate(item.dt)}
            </div>
            <div className="flex h-full items-center justify-center">
              <IconComponent
                weatherCode={item.weather[0].id}
                x={item.sys.pod}
                className="h-8 w-8"
              />
            </div>
            <div className="flex justify-center">
              {Math.floor(item.main.temp)}&deg;
            </div>
          </div>
        ))}
      </div>
      
    </div>
    </>
  );
}
