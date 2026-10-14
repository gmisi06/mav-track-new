import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const TripPolyLine = () => {
  const [delayedDecoded, setDelayedDecoded] = useState<
    [number, number][] | null
  >(null);

  const tripPolyline = useSelector(
    (state: RootState) => state.polyline.polyline
  );

  useEffect(() => {
    if (!tripPolyline || tripPolyline.trim() === "") {
      setDelayedDecoded(null);
      return;
    }

    const timeout = setTimeout(() => {
      try {
        const decoded = polyline
          .decode(tripPolyline)
          .map(([lat, lon]) => [lat, lon] as [number, number]);
        setDelayedDecoded(decoded);
      } catch (error) {
        console.error("Hibás polyline adat:", error);
        setDelayedDecoded(null);
      }
    }, 750);

    return () => clearTimeout(timeout);
  }, [tripPolyline]);

  if (!delayedDecoded) return null;

  return (
    <Polyline
      positions={delayedDecoded}
      pathOptions={{ color: "blue", weight: 4 }}
    />
  );
};

export default TripPolyLine;
