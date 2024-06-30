import { City, HourlyForecastDataInd } from "@/lib/types";
import IconComponent from "../ui/IconComponent";
import { convertToDate, getActualTimeForTimezone, getTime } from "@/utils/date";
import moment from "moment-timezone";
import Clock from "./Clock";

interface CurrentWeatherProps {
  data: HourlyForecastDataInd;
  city: City;
}

export default function CurrentWeather({ data, city }: CurrentWeatherProps) {
  const localTime = getActualTimeForTimezone(city.timezone);
  
  return (
    <div className="relative flex h-fit w-full shrink-0 flex-col g-8 overflow-hidden p-12">
      <div className="absolute " />
      <div>
        <div className="flex justify-between text-lg font-semibold">
          <span>{convertToDate(city.timezone, data.dt, "long")}</span>
        </div>
        <Clock city={city} localTime={localTime} />
        <div className="flex flex-row items-center text-md mt-2 flex font-bold">
          <span className="mr-1">{city.name},{city.country}</span>          
        </div>
      </div>
      <div className="flex justify-center py-3 text-4xl font-bold">
        {Math.round(data.main.temp)}&deg;
      </div>
      <div>
        <IconComponent
          weatherCode={data.weather[0].id}
          x={data.sys.pod}
          className="h-9 w-9"
        />
        <div className="font-semibold">{data.weather[0].main}</div>
        <div className="flex gap-2 dark:text-neutral-500">
          <span>High: {Math.round(data.main.temp_max)}&deg;</span>
          <span>Low: {Math.round(data.main.temp_min)}&deg;</span>
        </div>
      </div>
    </div>
  );
}
