import { formatStormCellSummary } from "@/lib/formatters/severe/storm";
import { getContract } from "@/lib/web3/agent";
import { FORECAST_AGENT_PROMPT, FORECAST_PROMPT } from "@/lib/web3/prompts";
import { SHA256 } from "crypto-js";
import NodeCache from "node-cache";

const cache = new NodeCache();

export const sha256 = (data: any) => {
  return SHA256(data).toString();
};

let lastHash: any = null;
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

  const example = {
    results: [
      {
        success: true,
        endpoint: "convective/outlook",
        response: [
          {
            category: "categorical overview",
            day: 3,
            risk: "general thunderstorms risk",
            eventTime: "2024-06-30T01:32:00-06:00",
            minRangeTime: "2024-07-02T06:00:00-06:00",
            maxRangTime: "2024-07-03T06:00:00-06:00",
          },
          {
            category: "tornado",
            day: 2,
            risk: "2% tornado risk",
            eventTime: "2024-06-29T23:59:00-06:00",
            minRangeTime: "2024-07-01T06:00:00-06:00",
            maxRangTime: "2024-07-02T06:00:00-06:00",
          },
          {
            category: "categorical overview",
            day: 2,
            risk: "slight risk",
            eventTime: "2024-06-29T23:59:00-06:00",
            minRangeTime: "2024-07-01T06:00:00-06:00",
            maxRangTime: "2024-07-02T06:00:00-06:00",
          },
          {
            category: "hail",
            day: 2,
            risk: "15% hail risk",
            eventTime: "2024-06-29T23:59:00-06:00",
            minRangeTime: "2024-07-01T06:00:00-06:00",
            maxRangTime: "2024-07-02T06:00:00-06:00",
          },
          {
            category: "wind",
            day: 1,
            risk: "5% wind risk",
            eventTime: "2024-06-30T06:55:00-06:00",
            minRangeTime: "2024-06-30T07:00:00-06:00",
            maxRangTime: "2024-07-01T06:00:00-06:00",
          },
          {
            category: "categorical overview",
            day: 1,
            risk: "marginal risk",
            eventTime: "2024-06-30T06:55:00-06:00",
            minRangeTime: "2024-06-30T07:00:00-06:00",
            maxRangTime: "2024-07-01T06:00:00-06:00",
          },
          {
            category: "hail",
            day: 1,
            risk: "5% hail risk",
            eventTime: "2024-06-30T06:55:00-06:00",
            minRangeTime: "2024-06-30T07:00:00-06:00",
            maxRangTime: "2024-07-01T06:00:00-06:00",
          },
          {
            category: "wind",
            day: 2,
            risk: "5% wind risk",
            eventTime: "2024-06-29T23:59:00-06:00",
            minRangeTime: "2024-07-01T06:00:00-06:00",
            maxRangTime: "2024-07-02T06:00:00-06:00",
          },
        ],
      },
      {
        success: true,
        endpoint: "fires/outlook",
        response: [
          {
            category: "fire weather outlooks",
            day: 2,
            risk: "elevated",
            eventTime: "2024-06-30T00:10:17-07:00",
            minRangeTime: "2024-07-01T05:00:00-07:00",
            maxRangTime: "2024-07-02T05:00:00-07:00",
          },
          {
            category: "fire weather outlooks",
            day: 1,
            risk: "critical",
            eventTime: "2024-06-30T00:00:18-07:00",
            minRangeTime: "2024-06-30T05:00:00-07:00",
            maxRangTime: "2024-07-01T05:00:00-07:00",
          },
        ],
      },
      {
        success: true,
        endpoint: "phrases/summary",
        response: [
          "Expect sunny skies with temperatures rising to 28 degrees through midday.",
        ],
      },
      {
        success: true,
        endpoint: "stormcells/summary",
        response: formatStormCellSummary([
          {
            summary: {
              id: "all",
              range: {
                count: 272,
                fromTimestamp: 1702512000,
                fromDateTimeISO: "2023-12-14T00:00:00+00:00",
                toTimestamp: 1702597192,
                toDateTimeISO: "2023-12-14T23:39:52+00:00",
                maxTimestamp: 1702597043,
                maxDateTimeISO: "2023-12-14T23:37:23+00:00",
                minTimestamp: 1702596511,
                minDateTimeISO: "2023-12-14T23:28:31+00:00",
              },
              tvs: {
                count: 0,
                min: 0,
                max: 0,
              },
              mda: {
                count: 36,
                threatCount: 0,
                min: 1,
                max: 6,
              },
              hail: {
                prob: {
                  count: 1,
                  threatCount: 0,
                  min: 0,
                  max: 50,
                  avg: 0,
                },
                probSevere: {
                  count: 0,
                  threatCount: 0,
                  min: 0,
                  max: 0,
                  avg: 0,
                },
                maxSize: {
                  count: 1,
                  maxIN: 0.5,
                  maxCM: 1.3,
                  minIN: 0,
                  minCM: 0,
                  avgIN: 0,
                  avgCM: 0,
                },
              },
              dbzm: {
                count: 272,
                min: 32,
                max: 58,
                avg: 42,
              },
              vil: {
                count: 263,
                min: 0,
                max: 12,
                avg: 2,
              },
              top: {
                count: 271,
                maxFT: 19200,
                maxM: 5852.16,
                minFT: 0,
                minM: 0,
                avgFT: 9449.3,
                avgM: 2880,
              },
              speed: {
                count: 177,
                maxKTS: 86.99972377152,
                maxKPH: 161,
                maxMPH: 100,
                maxMPS: 45,
                minKTS: 1.99999364992,
                minKPH: 4,
                minMPH: 2,
                minMPS: 1,
                avgKTS: 41,
                avgKPH: 76,
                avgMPH: 47,
                avgMPS: 21,
              },
              states: ["nd", "ak", "nm", "fl", "ks", "tx", "ok", "ne"],
              traits: {
                general: 269,
                hail: 0,
                rotating: 3,
                tornado: 0,
                threat: 136,
              },
              geoPoly: null,
            },
          },
        ]),
      },
    ],
    fetchedAt: "2024-06-30T13:34:35.288Z",
  };

  const currentHash = sha256(JSON.stringify(resp));

  const lastHash = cache.get("lastHash");
  const dataChanged = lastHash != currentHash;

  if (dataChanged) {
    console.log("Hash has changed", lastHash, "currentHash", currentHash);
    cache.set("lastHash", currentHash);
    const contract = getContract();
    const query = FORECAST_PROMPT({
      forecastData: example.results,
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
