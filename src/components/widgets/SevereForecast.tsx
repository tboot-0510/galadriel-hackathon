"use client";

import { timeAgo } from "@/utils/date";
import IconComponent from "../ui/IconComponent";
import { formatFireResponse } from "@/lib/formatters/severe/fire";
import { formatConvectiveOutlookResponse } from "@/lib/formatters/severe/outlook";
import { formatPhrasesResponse } from "@/lib/formatters/severe/summary";
import { formatStormCellResponse, formatStormCellSummary } from "@/lib/formatters/severe/storm";

const severeIconMapping = {
  "convective/outlook": "for potential hasards",
  "fires/outlook": "for fires",
  "stormcells/summary": "for storms",
  "phrases/summary": "for upcoming hours"
}

const formattingFunc = {
  "convective/outlook": formatConvectiveOutlookResponse,
  "fires/outlook": formatFireResponse,
  "stormcells/summary": formatStormCellResponse,
  "phrases/summary": formatPhrasesResponse
}

function getCategory(endpoint:string){
  return severeIconMapping[endpoint];
}

function getEndpointResp(endpoint:string, response:any){
  const formatFunc = formattingFunc[endpoint];
  return formatFunc(response);
}

export default function SevereForecast({ data }: any) {

  if (!data) return <></>;

  const {fetchedAt, results} = data;

  return (
    <div
      className="col-span-2 flex h-min-56 flex-col overflow-hidden overscroll-contain scroll-smooth pt-4 p-6 ring-offset-background transition-colors scrollbar-hide hover:overflow-x-auto focus:scroll-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ border: "1px solid white", borderRadius: "25px", backgroundColor: "white" }}
    >
      <div className="flex flex-row justify-between">
        <h2 className="text-l font-semibold">Forecast for following hours</h2>
        <p className="text-gray-500 text-sm">fetched {timeAgo(fetchedAt)}</p>
      </div>
      
      {results.map((item: any, i: number) => {
        const {endpoint, response} = item;
        if (!response) return;
        return (
          <div key={i} className="flex flex-row h-full items-center">
            <div className="flex h-full justify-center mr-4">
              <IconComponent
                weatherCode={item.endpoint}
                className="h-8 w-8"
              />
            </div>
            <div className="flex justify-center">
              {response.length > 0 ? <div dangerouslySetInnerHTML={{ __html: getEndpointResp(endpoint, response) }} />: `Nothing forecasted ${getCategory(endpoint)}`}
            </div>
          </div>
        )
      })}
    </div>
  );
}
