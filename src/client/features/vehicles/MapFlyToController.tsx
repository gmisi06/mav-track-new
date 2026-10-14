import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const MapFlyToController = () => {
  const map = useMap();
  const myPosition = useSelector(
    (state: RootState) => state.myPosition.coordinates
  );

  useEffect(() => {
    if (!myPosition) return;

    const { lat, lon } = myPosition;
    map.flyTo([lat, lon], 12, {
      duration: 0.5,
    });
  }, [myPosition]);

  return null;
};

export default MapFlyToController;
