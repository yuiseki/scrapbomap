/* eslint-disable @next/next/no-img-element */
import { GyamapResponse } from "@/types/GyamapResponse";
import { useCallback } from "react";
import { useMap } from "react-map-gl";

export const Title: React.FC<{ projectName: string; poi: GyamapResponse }> = ({
  projectName,
  poi,
}) => {
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
    <li style={{ marginTop: "5px" }}>
      <a
        target="_blank"
        href={`https://scrapbox.io/${projectName}/${poi.title}`}
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
        {poi.title}
      </span>
      {poi.desc && poi.desc.length > 0 && (
        <>
          <span>: </span>
          <span>{poi.desc}</span>
        </>
      )}
    </li>
  );
};
