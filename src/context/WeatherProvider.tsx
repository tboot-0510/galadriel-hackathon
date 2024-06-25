"use client";
import React, { useContext, useMemo, useState } from "react";

type WeatherContextProps = {
  weatherData: null;
  lastDay: null;
  setWeatherData: ({}: any) => void;
  setLastDayData: ({}: any) => void;
};

const WEATHER_CONTEXT = React.createContext<WeatherContextProps>({
  weatherData: null,
  lastDay: null,
  setWeatherData: () => {},
  setLastDayData: () => {},
});

const useWeatherData = () => useContext(WEATHER_CONTEXT);

const WeatherDataProvider = ({ children }: any) => {
  const [weatherData, setWeatherData] = useState(null);
  const [lastDay, setLastDayData] = useState(null);

  const value = useMemo(
    () => ({
      weatherData,
      lastDay,
      setWeatherData,
      setLastDayData,
    }),
    [weatherData, lastDay, setWeatherData, setLastDayData]
  );

  return (
    <WEATHER_CONTEXT.Provider value={value}>
      {children}
    </WEATHER_CONTEXT.Provider>
  );
};

export { useWeatherData };
export default WeatherDataProvider;
