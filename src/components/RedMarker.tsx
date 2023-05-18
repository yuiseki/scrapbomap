/* eslint-disable @next/next/no-img-element */
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
  photo,
}) => {
  const { current: map } = useMap();
  const [currentZoom, setCurrentZoom] = useState(7);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!map) return;

    map.on("zoomend", (e) => {
      setCurrentZoom(e.viewState.zoom);
    });
  }, [map]);

  useEffect(() => {
    let newOpacity = 1;
    if (!currentZoom) {
      newOpacity = 1;
    } else {
      if (currentZoom < 8) {
        newOpacity = 0.7;
      } else if (currentZoom < 9) {
        newOpacity = 0.75;
      } else if (currentZoom < 12) {
        newOpacity = 0.8;
      } else if (currentZoom < 13) {
        newOpacity = 0.85;
      } else if (currentZoom < 14) {
        newOpacity = 0.9;
      } else {
        newOpacity = 1;
      }
    }
    setOpacity(newOpacity);
  }, [currentZoom]);

  const flyTo = useCallback(
    (e: MapboxEvent<MouseEvent>) => {
      if (!map) return;

      map.flyTo({ center: [longitude, latitude], zoom: 15 });
    },
    [map, longitude, latitude]
  );

  const size = 30;

  return (
    <SimpleMarker latitude={latitude} longitude={longitude} onClick={flyTo}>
      <div
        className={styles.RedMarkerWrap}
        title={`${title}\r\n${desc}`}
        style={{
          opacity: opacity,
        }}
      >
        <div className={styles.RedMarkerBalloon}>
          <div
            className={`${styles.RedMarkerBalloonTitle} ${styles.RedMarkerBalloonTitleMoreZoom}`}
          >
            {6 < currentZoom && photo && photo.length > 0 ? (
              <img
                alt={title}
                style={{
                  height: `${size}px`,
                  width: `${size}px`,
                  objectFit: "cover",
                  cursor: "zoom-in",
                  opacity: opacity - 0.5,
                }}
                src={photo}
                loading="lazy"
              />
            ) : (
              <span
                style={{
                  display: "inline-block",
                  height: `${size}px`,
                  width: `${size}px`,
                  lineHeight: `${size}px`,
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                ・
              </span>
            )}
          </div>
        </div>
      </div>
    </SimpleMarker>
  );
};
