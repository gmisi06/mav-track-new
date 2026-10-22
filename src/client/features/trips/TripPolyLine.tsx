import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import { Layer, Source } from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import type { LineLayerSpecification } from "maplibre-gl";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { LAYER_IDS } from "../vehicles/mapConfig";

const EMPTY_LINE: FeatureCollection = { type: "FeatureCollection", features: [] };

const lineLayout: LineLayerSpecification["layout"] = {
  "line-join": "round",
  "line-cap": "round",
};
const linePaint: LineLayerSpecification["paint"] = {
  "line-color": "blue",
  "line-width": 4,
};

// A forrás és a réteg mindig a térképen van (üres adattal, ha nincs járat),
// így a rétegsorrend nem függ attól, mikor választanak ki egy járatot.
const TripPolyLine = () => {
  const [delayedLine, setDelayedLine] = useState<LineString | null>(null);

  const tripPolyline = useSelector(
    (state: RootState) => state.polyline.polyline
  );

  useEffect(() => {
    if (!tripPolyline || tripPolyline.trim() === "") {
      setDelayedLine(null);
      return;
    }

    const timeout = setTimeout(() => {
      try {
        setDelayedLine(polyline.toGeoJSON(tripPolyline));
      } catch (error) {
        console.error("Hibás polyline adat:", error);
        setDelayedLine(null);
      }
    }, 750);

    return () => clearTimeout(timeout);
  }, [tripPolyline]);

  return (
    <Source id="trip-line" type="geojson" data={delayedLine ?? EMPTY_LINE}>
      <Layer
        id={LAYER_IDS.tripLine}
        type="line"
        layout={lineLayout}
        paint={linePaint}
      />
    </Source>
  );
};

export default TripPolyLine;
