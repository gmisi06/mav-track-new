import { Layer, Source } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point } from "geojson";
import type { CircleLayerSpecification } from "maplibre-gl";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import stops from "../data/train_stops.json";
import { LAYER_IDS, STOPS_MIN_ZOOM } from "../mapConfig";
import { getLastPassedIndex } from "../../trips/vehicleProgress";
import { useGetTripQuery } from "../../trips/api/tripsApiSlice";
import type { RootState } from "../../../store/store";

type NamedPoint = {
  name: string;
  lat: number;
  lon: number;
  passed?: boolean;
};

const toFeatureCollection = (points: NamedPoint[]): FeatureCollection<Point> => ({
  type: "FeatureCollection",
  features: points.map((stop) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [stop.lon, stop.lat] },
    properties: { name: stop.name, passed: stop.passed === true },
  })),
});

const allStopsFeatureCollection = toFeatureCollection(stops);

const stopPaint: CircleLayerSpecification["paint"] = {
  "circle-radius": 5,
  // Az elhagyott megállók sötétszürkék, mint a járat panelen.
  "circle-color": ["case", ["get", "passed"], "#4d4d4d", "#ffffff"],
  "circle-stroke-color": "#737373",
  "circle-stroke-width": 4,
};

export default function VehicleStopMarkers() {
  const selectedTripId = useSelector(
    (state: RootState) => state.selectedTripId.tripId
  );
  // Ugyanaz a lekérdezés, mint a járat panelé, így a gyorsítótárból jön.
  const { data: trip } = useGetTripQuery(selectedTripId!, {
    skip: selectedTripId == null,
  });

  // Kijelölt járatnál csak az általa érintett megállók látszanak, bármilyen nagyításnál.
  const data = useMemo(() => {
    if (selectedTripId == null) return allStopsFeatureCollection;
    const lastPassed = getLastPassedIndex(trip?.stoptimes, trip?.nextStop);
    return toFeatureCollection(
      (trip?.stoptimes ?? [])
        .map((stoptime: any, index: number) => ({
          ...stoptime.stop,
          passed: index <= lastPassed,
        }))
        .filter((stop: any) => stop.lat != null && stop.lon != null)
    );
  }, [selectedTripId, trip]);

  return (
    <Source id="train-stops" type="geojson" data={data}>
      <Layer
        id={LAYER_IDS.stops}
        type="circle"
        minzoom={selectedTripId == null ? STOPS_MIN_ZOOM : 0}
        paint={stopPaint}
      />
    </Source>
  );
}
