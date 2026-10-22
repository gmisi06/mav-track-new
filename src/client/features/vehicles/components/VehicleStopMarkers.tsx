import { Layer, Source } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point } from "geojson";
import type { CircleLayerSpecification } from "maplibre-gl";
import stops from "../data/train_stops.json";
import { LAYER_IDS, STOPS_MIN_ZOOM } from "../mapConfig";

const stopsFeatureCollection: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: stops.map((stop) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [stop.lon, stop.lat] },
    properties: { name: stop.name },
  })),
};

const stopPaint: CircleLayerSpecification["paint"] = {
  "circle-radius": 5,
  "circle-color": "#ffffff",
  "circle-stroke-color": "#737373",
  "circle-stroke-width": 4,
};

export default function VehicleStopMarkers() {
  return (
    <Source id="train-stops" type="geojson" data={stopsFeatureCollection}>
      <Layer
        id={LAYER_IDS.stops}
        type="circle"
        minzoom={STOPS_MIN_ZOOM}
        paint={stopPaint}
      />
    </Source>
  );
}
