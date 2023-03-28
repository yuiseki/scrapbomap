import { SimpleMarker } from "./SimpleMarker";
import styles from "@/styles/RedMarker.module.css";
import { MapboxEvent, useMap } from "react-map-gl";
import { useCallback, useEffect, useState } from "react";

type RedMarkerProps = {
  latitude: number;
  longitude: number;
  title: string;
  desc?: string;
  photo?: string;
  icon: string;
};

export const RedMarker: React.FC<RedMarkerProps> = ({
  latitude,
  longitude,
  title,
  desc,
}) => {
  const { current: map } = useMap();
  const [currentZoom, setCurrentZoom] = useState(7);

  useEffect(() => {
    if (!map) return;

    map.on("zoomend", (e) => {
      setCurrentZoom(e.viewState.zoom);
    });
  }, [map]);

  const flyTo = useCallback(
    (e: MapboxEvent<MouseEvent>) => {
      if (!map) return;

      if (currentZoom < 17) {
        map.flyTo({ center: [longitude, latitude], zoom: 17 });
      }
    },
    [map, currentZoom, longitude, latitude]
  );

  return (
    <SimpleMarker latitude={latitude} longitude={longitude} onClick={flyTo}>
      <div
        className={styles.RedMarkerWrap}
        title={`${title}\r\n${desc}`}
        style={{
          opacity: (() => {
            if (!currentZoom) {
              return 1;
            } else {
              if (currentZoom < 8) {
                return 0.7;
              } else if (currentZoom < 9) {
                return 0.75;
              } else if (currentZoom < 12) {
                return 0.8;
              } else if (currentZoom < 13) {
                return 0.85;
              } else if (currentZoom < 14) {
                return 0.9;
              } else {
                return 1;
              }
            }
          })(),
        }}
      >
        <div className={styles.RedMarkerBalloon}>
          <div
            className={`${styles.RedMarkerBalloonTitle} ${styles.RedMarkerBalloonTitleMoreZoom}`}
          >
            ・
          </div>
        </div>
      </div>
    </SimpleMarker>
  );
};
