"use client";

import IconComponent from "../ui/IconComponent";

const severeIconMapping = {
  "convective/outlook": "for potential hasards",
  "fires/outlook": "for fires",
  "lightning/threats": "for lightning",
  "stormcells/summary": "for storms",
  "phrases/summary": "for upcoming hours"
}

function getCategory(endpoint:string){
  return severeIconMapping[endpoint];
}

export default function SevereForecast({ data }: any) {
  function extractHoursFromDate(dt: number): string {
    const date = new Date(dt * 1000);
    return date.getHours() + "h";
  }

  if (!data) return <></>;

  console.log("data", data)

  return (
    <div
      className="col-span-2 flex h-56 flex-col overflow-hidden overscroll-contain scroll-smooth pt-4 p-6 ring-offset-background transition-colors scrollbar-hide hover:overflow-x-auto focus:scroll-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ border: "1px solid white", borderRadius: "25px", backgroundColor: "white" }}
    >
      <h2 className="text-l font-semibold">Forecast for following hours</h2>
      {data.map((item: any, i: number) => {
        const {endpoint, response} = item;
        return (
          <div key={i} className="flex flex-row h-full items-center">
            <div className="flex h-full justify-center mr-4">
              <IconComponent
                weatherCode={item.endpoint}
                className="h-8 w-8"
              />
            </div>
            <div className="flex justify-center">
              {response.length > 0 ? response : `Nothing forecasted ${getCategory(endpoint)}`}
            </div>
          </div>
        )
      })}
    </div>
  );
}
