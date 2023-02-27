import { Marker } from "react-map-gl";

type SimpleMarkerProps = {
  latitude: number;
  longitude: number;
  zIndex?: number;
  onClick?: (e: mapboxgl.MapboxEvent<MouseEvent>) => void;
  children?: JSX.Element;
};

export const SimpleMarker: React.FC<SimpleMarkerProps> = ({
  latitude,
  longitude,
  zIndex,
  onClick,
  children,
}) => {
  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      onClick={(e) => {
        onClick && onClick(e);
      }}
      anchor="bottom"
      style={zIndex ? { zIndex: zIndex } : {}}
    >
      {children}
    </Marker>
  );
};
