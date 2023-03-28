/* eslint-disable @next/next/no-img-element */
import { GyamapResponse } from "@/types/GyamapResponse";
import { useCallback } from "react";
import { LngLatLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";

export const Title: React.FC<{
  projectName: string;
  poi: turf.helpers.Feature;
}> = ({ projectName, poi }) => {
  const { mainMap: map } = useMap();

  const flyTo = useCallback(
    (e: any) => {
      if (!map) return;
      if (poi.geometry.type !== "Point") return;

      map.flyTo({
        center: poi.geometry.coordinates as LngLatLike,
        zoom: map.getZoom(),
      });
    },
    [map, poi]
  );

  if (!poi.properties) {
    return null;
  }

  return (
    <li style={{ marginTop: "5px" }}>
      <a
        target="_blank"
        href={`https://scrapbox.io/${projectName}/${poi.properties.title}`}
      >
        <img
          alt="Go to Scrapbox"
          width={18}
          height={18}
          src="https://scrapbox.io/assets/img/favicon/favicon.ico"
        />
      </a>
      <span> </span>
      <span onClick={flyTo} style={{ fontWeight: "bold", cursor: "zoom-in" }}>
        {poi.properties.title}
      </span>
      {poi.properties.descriptions && poi.properties.descriptions.length > 0 && (
        <>
          <span>: </span>
          <span>{poi.properties.descriptions.join("")}</span>
        </>
      )}
    </li>
  );
};
