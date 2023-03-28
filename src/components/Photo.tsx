/* eslint-disable @next/next/no-img-element */
import { GyamapResponse } from "@/types/GyamapResponse";
import { useCallback } from "react";
import { LngLatLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";

export const Photo: React.FC<{ poi: turf.helpers.Feature }> = ({ poi }) => {
  const { mainMap: map } = useMap();

  const flyTo = useCallback(
    (e: any) => {
      if (!map) return;
      if (poi.geometry.type !== "Point") return;

      let zoomTo = map.getZoom();
      if (zoomTo < 15) {
        zoomTo = 15;
      }

      map.flyTo({
        center: poi.geometry.coordinates as LngLatLike,
        zoom: zoomTo,
      });
    },
    [map, poi]
  );

  if (!poi.properties) {
    return null;
  }

  return (
    <div
      style={{
        margin: "0 5px 5px",
        cursor: "zoom-in",
      }}
      onClick={flyTo}
      title={`${poi.properties.title}\r\n${poi.properties.descriptions[0]}`}
    >
      {poi.properties.image ? (
        <img
          alt={poi.properties.title}
          style={{
            height: "195px",
            width: "195px",
            objectFit: "cover",
          }}
          src={poi.properties.image}
          loading="lazy"
        />
      ) : (
        <span
          title={poi.properties.title}
          style={{
            display: "inline-block",
            height: "195px",
            width: "195px",
            lineHeight: "195px",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          no image
        </span>
      )}
    </div>
  );
};
