"use client";
import CollapsibleRow from "@/components/CollapsibleRow";
import CurrentWeather from "@/components/widgets/CurrentWeather";
import { City, HourlyForecastDataInd, LandCoord } from "@/lib/types";
import Button from "../Button";
import Link from "next/link";

interface CustomerInfoProps {
  data: HourlyForecastDataInd;
  city: City;
  coordinates: LandCoord[];
}

export default function CustomerInfo({
  data,
  city,
  coordinates,
}: CustomerInfoProps) {
  return (
    <div className="customer-info">
      <CurrentWeather data={data} city={city} />
      <div className="flex flex-col w-full p-4">
        <Link
          className="group rounded-md border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
          href={{
            pathname: "/claims",
          }}
        >
          <h2 className="text-l font-semibold">
            Claims{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </Link>
        <p className="mb-4">Your registered lands:</p>
        {coordinates && (
          <div className="flex flex-col gap-2">
            {coordinates?.map((coord: LandCoord, idx: number) => {
              return (
                <CollapsibleRow
                  key={idx}
                  item={{ title: `Land #${idx + 1}`, coordinates: coord }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
