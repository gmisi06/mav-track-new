import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import { Layer, Source, useMap } from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import type { LineLayerSpecification } from "maplibre-gl";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FOCUS_ZOOM, LAYER_IDS } from "../vehicles/mapConfig";

/** Az útvonalat úgy illesztjük a látható térképre, hogy a panel ne takarja ki. */
function fitPadding() {
  const base = 50;
  if (window.matchMedia("(max-width: 768px)").matches) {
    return { top: base, left: base, right: base, bottom: base + 60 };
  }
  const sidebar = document.querySelector<HTMLElement>(".sidebar.open");
  return {
    top: base,
    left: base,
    bottom: base,
    right: base + (sidebar?.offsetWidth ?? 0),
  };
}

const EMPTY_LINE: FeatureCollection = { type: "FeatureCollection", features: [] };

const LINE_COLOR = "#274f96";

const lineLayout: LineLayerSpecification["layout"] = {
  "line-join": "round",
  "line-cap": "round",
};

// A forrás és a réteg mindig a térképen van (üres adattal, ha nincs járat),
// így a rétegsorrend nem függ attól, mikor választanak ki egy járatot.
const TripPolyLine = () => {
  const { current: map } = useMap();
  const linePaint: LineLayerSpecification["paint"] = {
    "line-color": LINE_COLOR,
    "line-width": 4,
  };
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

  useEffect(() => {
    const coordinates = delayedLine?.coordinates;
    if (!map || !coordinates?.length) return;

    const [first, ...rest] = coordinates;
    const bounds = rest.reduce(
      (box, [lon, lat]) => ({
        west: Math.min(box.west, lon),
        east: Math.max(box.east, lon),
        south: Math.min(box.south, lat),
        north: Math.max(box.north, lat),
      }),
      { west: first[0], east: first[0], south: first[1], north: first[1] }
    );
    map.fitBounds(
      [
        [bounds.west, bounds.south],
        [bounds.east, bounds.north],
      ],
      { padding: fitPadding(), duration: 700, maxZoom: FOCUS_ZOOM + 2 }
    );
  }, [map, delayedLine]);

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
