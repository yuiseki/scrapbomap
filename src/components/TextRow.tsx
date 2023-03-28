/* eslint-disable @next/next/no-img-element */
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
      <a target="_blank" href={poi.properties.url}>
        {poi.properties.url.startsWith("https://scrapbox.io") ? (
          <img
            alt="Go to Scrapbox"
            width={18}
            height={18}
            src="https://scrapbox.io/assets/img/favicon/favicon.ico"
          />
        ) : (
          <img
            alt="Go to Gyazo"
            width={18}
            height={18}
            src="https://gyazo.com/favicon.ico"
          />
        )}
      </a>
      <span> </span>
      <span onClick={flyTo} style={{ fontWeight: "bold", cursor: "zoom-in" }}>
        {poi.properties.title}
      </span>
      {poi.properties.descriptions && poi.properties.descriptions.length > 0 && (
        <>
          <span>: </span>
          <span>{poi.properties.descriptions}</span>
        </>
      )}
    </li>
  );
};
