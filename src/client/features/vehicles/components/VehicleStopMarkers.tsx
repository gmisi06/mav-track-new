import { Marker, Tooltip } from "react-leaflet";
import { useMap } from "react-leaflet";
import { useCallback, useEffect, useState } from "react";
import { divIcon } from "leaflet";
import stops from "../data/train_stops.json";
import styles from "./Vehicle.module.css";

interface Stop {
  name: string;
  lat: number;
  lon: number;
}

export default function VehicleStopMarkers() {
  const map = useMap();
  const [visibleStops, setVisibleStops] = useState<Stop[]>([]);

  const updateVisibleStops = useCallback(() => {
    const bounds = map.getBounds();
    const currentZoom = map.getZoom();

    if (currentZoom >= 12) {
      const filtered = stops.filter((stop) =>
        bounds.contains([stop.lat, stop.lon])
      );
      setVisibleStops(filtered);
    } else {
      setVisibleStops([]);
    }
  }, [map]);

  useEffect(() => {
    updateVisibleStops();
    map.on("moveend", updateVisibleStops);
    map.on("zoomend", updateVisibleStops);

    return () => {
      map.off("moveend", updateVisibleStops);
      map.off("zoomend", updateVisibleStops);
    };
  }, [updateVisibleStops]);

  return (
    <>
      {visibleStops.map((stop) => (
        <Marker
          key={stop.name}
          position={[stop.lat, stop.lon]}
          zIndexOffset={100}
          icon={divIcon({
            className: "",
            html: `
                  <div
                    class=${styles.vehicleStopMarker}
                  ></div>
                  `,
            iconSize: [30, 30],
          })}
        >
          <Tooltip>{stop.name}</Tooltip>
        </Marker>
      ))}
    </>
  );
}
