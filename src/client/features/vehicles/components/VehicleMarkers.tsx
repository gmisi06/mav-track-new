import { useEffect, useMemo, useState } from "react";
import { Layer, Source } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point } from "geojson";
import type { SymbolLayerSpecification } from "maplibre-gl";
import { useGetVehiclesQuery } from "../api/vehiclesApiSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { setVehicles } from "../store/vehiclesSlice";
import MapOverlay from "./MapOverlay";
import styles from "./Vehicle.module.css";
import { headingIconId, vehicleIconExpression } from "./vehicleIcons";
import { useColorScheme } from "../../../shared/hooks/useColorScheme";
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
      mode: vehicle.trip.route?.mode,
      heading: vehicle.heading,
    },
  })),
});

const VehicleMarkers = ({ isMapLoaded }: VehicleMarkersParams) => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const headingLayout = useMemo(
    () => ({ ...headingLayoutBase, "icon-image": headingIconId(scheme) }),
    [scheme]
  );
  const vehicleLayout = useMemo(
    () => ({ ...vehicleLayoutBase, "icon-image": vehicleIconExpression(scheme) }),
    [scheme]
  );

  const [isRateLimited, setIsRateLimited] = useState(false);

  const {
    data: vehicles,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetVehiclesQuery(null, {
    // A szerver 30 mp-ig cache-el, ennél gyakrabban felesleges kérdezni.
    // Rate limit esetén ritkábban kérdezünk, hogy tehermentesítsük a MÁV szerverét.
    pollingInterval: isRateLimited ? 60_000 : 30_000,
    skipPollingIfUnfocused: true,
  });

  // Csak a lezárult kérés eredménye számít, a folyamatban lévő nem billentheti át az állapotot.
  useEffect(() => {
    if (isFetching) return;
    const upstreamStatus = (error as { data?: { upstreamStatus?: number } })
      ?.data?.upstreamStatus;
    setIsRateLimited(
      isError && (upstreamStatus === 403 || upstreamStatus === 429)
    );
  }, [isFetching, isError, error]);

  useEffect(() => {
    if (vehicles) {
      dispatch(setVehicles(vehicles));
    }
  }, [vehicles]);

  const selectedTripId = useSelector(
    (state: RootState) => state.selectedTripId.tripId
  );

  // Kijelölt járatnál csak az a vonat látszik a térképen.
  const featureCollection = useMemo(
    () =>
      toFeatureCollection(
        selectedTripId == null
          ? vehicles ?? []
          : (vehicles ?? []).filter(
              (vehicle: any) => vehicle.trip.id === selectedTripId
            )
      ),
    [vehicles, selectedTripId]
  );

  // Hiba csak akkor takarja el a térképet, ha még nincs egyetlen adatunk sem.
  if (!isMapLoaded || isLoading || (isError && !vehicles))
    return (
      <MapOverlay>
        {isRateLimited
          ? "Türelmet kérünk, a MÁV szervere jelenleg korlátozza a lekérdezéseket. Percenként újrapróbáljuk..."
          : isError
          ? "Hiba történt a járművek lekérése közben..."
          : "Térkép betöltése..."}
      </MapOverlay>
    );

  return (
    <>
      {isError && (
        <div className={styles.mapNotice} role="status">
          {isRateLimited
            ? "Türelmet kérünk, a MÁV szervere korlátozza a lekérdezéseket. Percenként újrapróbáljuk, addig a korábbi állapotot látja."
            : "Az adatok frissítése nem sikerült, a korábbi állapotot látja."}
        </div>
      )}
      <Source id="vehicles" type="geojson" data={featureCollection}>
      <Layer
        id={LAYER_IDS.vehicleHeadings}
        type="symbol"
        filter={["==", ["typeof", ["get", "heading"]], "number"]}
        layout={headingLayout}
      />
      <Layer id={LAYER_IDS.vehicles} type="symbol" layout={vehicleLayout} />
      </Source>
    </>
  );
};

const headingLayoutBase: SymbolLayerSpecification["layout"] = {
  "icon-rotate": ["get", "heading"],
  "icon-rotation-alignment": "map",
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
};

const vehicleLayoutBase: SymbolLayerSpecification["layout"] = {
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
};

export default VehicleMarkers;
