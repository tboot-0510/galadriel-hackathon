"use client";

import { useState } from "react";

export default function CollapsibleRow({ item }: any) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const iconNameOpen = isOpen ? "CaretUp" : "CaretDown";

  return (
    <div
      className="p-2"
      style={{ border: "1px solid white", borderRadius: "25px" }}
      onClick={() => setOpen(!isOpen)}
    >
      <div className="f fd-r jc-sb w-100-p bs-bb">
        <div className="expandable-card-title">{item.title}</div>
        <div className="expandable-card-icon">
          {/* {iconMap[iconNameOpen]({
            size: 16,
            color: "var(--color)",
            weight: "regular",
          })} */}
        </div>
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
