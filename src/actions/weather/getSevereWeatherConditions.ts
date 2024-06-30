import { formatStormCellSummary } from "@/lib/formatters/severe/storm";
import { getContract } from "@/lib/web3/agent";
import { FORECAST_AGENT_PROMPT, FORECAST_PROMPT } from "@/lib/web3/prompts";
import { SHA256 } from "crypto-js";
import NodeCache from "node-cache";

const cache = new NodeCache();

export const sha256 = (data: any) => {
  return SHA256(data).toString();
};

export const getSevereWeatherConditions = async ({
  lat,
  lon,
  city,
  premium,
  action,
}: {
  lat: string;
  lon: string;
  city: string;
  premium: any;
  action: string;
}) => {
  const url = `${process.env.VERCEL_URL}/api/weather/severe?lat=${lat}&lon=${lon}&action=${action}`;
  const data = await fetch(url, { next: { revalidate: 3600 } });

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  const resp = await data.json();

  const currentHash = sha256(JSON.stringify(resp));

  const lastHash = cache.get("lastHash");
  const dataChanged = lastHash != currentHash;

  if (dataChanged) {
    console.log("Hash has changed", lastHash, "currentHash", currentHash);
    cache.set("lastHash", currentHash);
    const contract = getContract();
    const query = FORECAST_PROMPT({
      forecastData: resp.results,
      date: new Date(),
      premium,
      location: city,
    });

    const transactionResponse = await contract.forecastPremium(
      query,
      FORECAST_AGENT_PROMPT
    );
    const receipt = await transactionResponse.wait();
    console.log(`Forecast transaction sent, tx hash: ${receipt.hash}`);
    return { ...resp, tx: receipt.hash };
  }

  return resp;
};
