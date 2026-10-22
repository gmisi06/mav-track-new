import { useMap } from "@vis.gl/react-maplibre";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FOCUS_ZOOM } from "./mapConfig";

const MapFlyToController = () => {
  const { current: map } = useMap();
  const myPosition = useSelector(
    (state: RootState) => state.myPosition.coordinates
  );

  useEffect(() => {
    if (!map || !myPosition) return;

    const { lat, lon } = myPosition;
    map.flyTo({ center: [lon, lat], zoom: FOCUS_ZOOM, duration: 500 });
  }, [map, myPosition]);

  return null;
};

export default MapFlyToController;
