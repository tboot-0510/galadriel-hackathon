"use client";
import Button from "../ui/Button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatDate } from "@/utils/date";
import { useWeatherData } from "@/context/WeatherProvider";
import { useEffect } from "react";
import { estimatePremium } from "@/lib/premiums";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getLastDay = (labels: any, scope: any) => {
  const reversedArray = scope.data.slice().reverse();
  const firstNonNullIdx = reversedArray.findIndex(
    (element: any) => element !== null
  );
  if (firstNonNullIdx === -1) {
    return labels[labels.length - 1];
  }

  return labels[scope.data.length - 1 - firstNonNullIdx];
};

export default function InsurancePremiumChart({ data }: any) {
  const chartData = {
    labels: data.daily.time.map(formatDate),
    datasets: [
      {
        label: "Temperature (°C)",
        data: Object.values(data.daily.temperature2mMax),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y1",
      },
      {
        label: "Precipitation (mm)",
        data: Object.values(data.daily.rainSum),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y2",
      },
      {
        label: "Wind Speed (km/h)",
        data: Object.values(data.daily.windSpeed10mMax),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y3",
      },
      {
        label: "Soil temp (°C)",
        data: Object.values(data.hourly.soilTemperature7To28cm),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y4",
      },
    ],
  };

  const options = {
    scales: {
      y1: {
        type: "linear",
        display: true,
        position: "left",
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: "linear",
        display: false,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
      y4: {
        type: "linear",
        display: false,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    elements:{
      point: {
        pointStyle: "false"
      }
    }
  };

  console.log("estimate", estimatePremium(chartData.datasets))

  const { weatherData, setWeatherData, setLastDayData } = useWeatherData();

  useEffect(() => {
    if (!weatherData) {
      setWeatherData(chartData);
      setLastDayData(getLastDay(chartData.labels, chartData.datasets[0]));
    }
  });

  return (
    <div className="insurance-premium-chart">
      {"Hallo"}
      {/* <Line data={chartData} options={options} /> */}
    </div>
  );
}
