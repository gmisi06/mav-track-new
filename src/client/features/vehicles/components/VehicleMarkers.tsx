import { useEffect, useMemo } from "react";
import { Layer, Source } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point } from "geojson";
import type { SymbolLayerSpecification } from "maplibre-gl";
import { useGetVehiclesQuery } from "../api/vehiclesApiSlice";
import { useDispatch } from "react-redux";
import { setVehicles } from "../store/vehiclesSlice";
import MapOverlay from "./MapOverlay";
import { HEADING_ICON_ID, vehicleIconExpression } from "./vehicleIcons";
import { LAYER_IDS } from "../mapConfig";

type VehicleMarkersParams = {
  isMapLoaded: boolean;
};

const toFeatureCollection = (vehicles: any[]): FeatureCollection<Point> => ({
  type: "FeatureCollection",
  features: vehicles.map((vehicle) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [vehicle.lon, vehicle.lat] },
    properties: {
      tripId: vehicle.trip.id,
      delay: vehicle.delay,
      heading: vehicle.heading,
    },
  })),
});

const VehicleMarkers = ({ isMapLoaded }: VehicleMarkersParams) => {
  const dispatch = useDispatch();

  const {
    data: vehicles,
    isLoading,
    isError,
  } = useGetVehiclesQuery(null, {
    pollingInterval: 60_000,
  });

  useEffect(() => {
    if (vehicles) {
      dispatch(setVehicles(vehicles));
    }
  }, [vehicles]);

  const featureCollection = useMemo(
    () => toFeatureCollection(vehicles ?? []),
    [vehicles]
  );

  if (!isMapLoaded || isLoading || isError)
    return (
      <MapOverlay>
        {isError
          ? "Hiba történt az járművek lekérése közben..."
          : "Térkép betöltése..."}
      </MapOverlay>
    );

  return (
    <Source id="vehicles" type="geojson" data={featureCollection}>
      <Layer
        id={LAYER_IDS.vehicleHeadings}
        type="symbol"
        filter={["==", ["typeof", ["get", "heading"]], "number"]}
        layout={headingLayout}
      />
      <Layer id={LAYER_IDS.vehicles} type="symbol" layout={vehicleLayout} />
    </Source>
  );
};

const headingLayout: SymbolLayerSpecification["layout"] = {
  "icon-image": HEADING_ICON_ID,
  "icon-rotate": ["get", "heading"],
  "icon-rotation-alignment": "map",
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
};

const vehicleLayout: SymbolLayerSpecification["layout"] = {
  "icon-image": vehicleIconExpression,
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
};

export default VehicleMarkers;
