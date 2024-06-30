"use client";
import { convertToISODate, formatDate, formatDateTime, getDaysInMonth, getOneDayAfter, getOneDayBefore, getUnixTimestamp, getUnixTimestampDayBefore } from "@/utils/date";
import { useWeatherData } from "@/context/WeatherProvider";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Contract } from "ethers";
import { getAgentRunId, getContract, getNewMessages } from "@/lib/web3/agent";
import { useRouter } from "next/navigation";
import { BrowserProvider } from "ethers";
import { getAgentId, getTxMessages } from "@/actions/web3";
import { Loading } from "../ui/Loading";

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

const getPercentageChange = (oldValue:number, newValue:number) => {
  const change = newValue - oldValue;
  const percentageChange = (change / oldValue) * 100;
  return percentageChange;
}

const getText = (prevDay:number, newValue:number) => {
  const up = prevDay < newValue;
  const dayMovement = up ? "📈" : "📉";
  const dayPctChange = getPercentageChange(prevDay, newValue).toFixed(2);
  if (prevDay){
    return `Premium price for ${formatDateTime(new Date(), true)} is ${dayMovement} by ${dayPctChange}%`
  }
  return `Premium price for ${formatDateTime(new Date(), true)}`

}

function extractQuoteValue(text:any) {
  const quoteKey = '"quote":';
  const startIndex = text.indexOf(quoteKey);
  
  if (startIndex === -1) return null; 

  const quoteStartIndex = startIndex + quoteKey.length;
  const quoteEndIndex = text.indexOf('}', quoteStartIndex);

  if (quoteEndIndex === -1) return null;

  const quoteValue = text.slice(quoteStartIndex, quoteEndIndex).trim();
  
  return parseFloat(quoteValue);
}

export default function InsurancePremiumChart({ tx, chartData, premiumInfo }: any) {
  const { weatherData, setWeatherData, setLastDayData } = useWeatherData();
  const router = useRouter();

  console.log("tx", tx)

  const [loading, setLoading]= useState(false);
  const [upcomingPremium, setUpcomingPremium] = useState("");

  useEffect(() => {
    if (!weatherData) {
      setWeatherData(chartData);
      setLastDayData(convertToISODate(getLastDay(chartData.labels, chartData.datasets[0])));
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let interval: any;
    const pollTransactionReceipt = async () => {
        const {ethereum} = window as any;
        const ethersProvider = new BrowserProvider(ethereum);

        const receipt = await ethersProvider.getTransactionReceipt(tx);
        if (!receipt) {
          timeoutId = setTimeout(pollTransactionReceipt, 2000);
          return;
        }
        console.log("receipt", receipt);
        return;
        
    };
    if (tx){
        setLoading(true);
        pollTransactionReceipt();
        interval = setInterval(() => {
          getTxMessages(tx).then((resp) => {
            if (!resp) return;
            console.log("resp", resp);
            if (resp?.status === "pending") return;
            if (resp?.status === "finished") {
              const {newMessages} = resp;
              setLoading(false);

              if (newMessages){
                const {content} = newMessages[0];
                const quote = extractQuoteValue(content);
                setUpcomingPremium(quote);
              }
              clearInterval(interval);
            }});
            return;
        }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (interval){
        clearInterval(interval);
      }
      
    };
    
  }, [tx]);

  return (
    <div className="flex flex-col border border-white rounded-[25px] bg-white text-black rounded-lg p-5">
      <div className="text-black text-l font-semibold">
        {getText(premiumInfo.prevDay, premiumInfo.daily)}
      </div>
      <div className="flex flex-row items-center justify-center gap-4 p-8">
        <div className="flex flex-col items-center justify-center py-3 p-8">
          <div className="text-3xl font-bold">{premiumInfo.prevDay || "-"}</div>
          <div className="flex gap-2 dark:text-neutral-500">
            {getOneDayBefore(new Date())}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-3 p-8">
          <div className="text-4xl font-bold">{premiumInfo.daily}</div>
          <div className="flex gap-2 dark:text-neutral-500">
            {formatDateTime(new Date())}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-3 p-8">
          <div className="text-3xl font-bold">
            {loading && <Loading />}
            {upcomingPremium}
          </div>
          <div className="gap-2 dark:text-neutral-500">
            {getOneDayAfter(new Date())}
          </div>
        </div>
      </div>
    </div>
  );
}
