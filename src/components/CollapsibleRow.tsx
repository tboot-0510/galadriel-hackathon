"use client";

import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function CollapsibleRow({ item }: any) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const iconNameOpen = isOpen ? "FaArrowUp" : "FaArrowDown";

  const iconMap = {
    FaArrowDown: (props:any) => <FaArrowDown {...props} />,
    FaArrowUp: (props:any) => <FaArrowUp {...props} />
  }

  return (
    <div
      className="p-2 group rounded-md border border-gray-300 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      onClick={() => setOpen(!isOpen)}
    >
      <div className="flex items-center">
        <div className="text-l font-semibold mr-1">{item.title}</div>
        {iconMap[iconNameOpen]({
            size: 12,
            color: "color",
            weight: "regular",
          })}
      </div>

      {isOpen && (
        <div className="expandable-card-subtext">
          {item.coordinates.map((coor: any, idx: any) => {
            return (
              <div key={idx}>{`Lat: ${coor.lat.toFixed(
                2
              )}, Long: ${coor.lng.toFixed(2)}`}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
