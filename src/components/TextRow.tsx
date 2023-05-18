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

  const size = 40;

  return (
    <li
      style={{
        display: "flex",
        marginTop: "5px",
        gap: "5px",
        lineHeight: `${size}px`,
        verticalAlign: "middle",
      }}
    >
      <a target="_blank" href={poi.properties.url}>
        {poi.properties.url.startsWith("https://scrapbox.io") ? (
          <img
            alt="Go to Scrapbox"
            width={size}
            height={size}
            src="https://scrapbox.io/assets/img/favicon/favicon.ico"
          />
        ) : (
          <img
            alt="Go to Gyazo"
            width={size}
            height={size}
            src="https://gyazo.com/favicon.ico"
          />
        )}
      </a>
      <span> </span>
      {poi.properties.image && poi.properties.image.length > 0 ? (
        <img
          alt={poi.properties.title}
          style={{
            height: `${size}px`,
            width: `${size}px`,
            objectFit: "cover",
            cursor: "zoom-in",
          }}
          src={poi.properties.image}
          loading="lazy"
          onClick={flyTo}
        />
      ) : (
        <span
          title={poi.properties.title}
          style={{
            display: "inline-block",
            height: `${size}px`,
            width: `${size}px`,
            lineHeight: `${size}px`,
            textAlign: "center",
            verticalAlign: "middle",
          }}
        ></span>
      )}
      {poi.properties.captured_at && (
        <>
          <span> </span>
          <span onClick={flyTo} style={{ cursor: "zoom-in" }}>
            {poi.properties.captured_at_str}
          </span>
        </>
      )}
      <>
        <span> </span>
        {poi.properties.title.startsWith("#") ||
        poi.properties.title === "Gyazo Android" ? (
          <span onClick={flyTo} style={{ cursor: "zoom-in" }}>
            {poi.properties.title}
          </span>
        ) : (
          <span
            onClick={flyTo}
            style={{ fontWeight: "bold", cursor: "zoom-in" }}
          >
            {poi.properties.title}
          </span>
        )}
      </>
      {poi.properties.descriptions && poi.properties.descriptions.length > 0 && (
        <>
          <span>: </span>
          <span>{poi.properties.descriptions}</span>
        </>
      )}
    </li>
  );
};
