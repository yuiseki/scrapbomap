/* eslint-disable @next/next/no-img-element */
import { GyamapResponse } from "@/types/GyamapResponse";
import { useCallback } from "react";
import { useMap } from "react-map-gl";

export const Photo: React.FC<{ poi: GyamapResponse }> = ({ poi }) => {
  const { mainMap: map } = useMap();

  const flyTo = useCallback(
    (e: any) => {
      if (!map) return;

      map.flyTo({
        center: [poi.longitude, poi.latitude],
        zoom: map.getZoom(),
      });
    },
    [map, poi]
  );

  return (
    <div
      style={{
        margin: "0 5px 5px",
        cursor: "pointer",
      }}
      onClick={flyTo}
      title={`${poi.title}\r\n${poi.desc}`}
    >
      <img
        alt={poi.title}
        style={{
          height: "195px",
          width: "195px",
          objectFit: "cover",
        }}
        src={poi.photo + "/raw"}
      />
    </div>
  );
};
