import { useState } from "react";
import Map, {
  GeolocateControl,
  NavigationControl,
  Popup,
  type MapLayerMouseEvent,
} from "@vis.gl/react-maplibre";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Point } from "geojson";
import { useDispatch, useSelector } from "react-redux";

import TrainStopMarkers from "./VehicleStopMarkers";
import TripPolyLine from "../../trips/TripPolyLine";
import MapFlyToController from "../MapFlyToController";
import VehicleMarkers from "./VehicleMarkers";
import VehiclePopup from "./VehiclePopup";
import TripHeadSign from "../../trips/TripHeadSign";
import TripInformation from "../../trips/TripInformation";
import { registerVehicleIcons } from "./vehicleIcons";
import { localizeLabels } from "../localizeLabels";
import {
  FOCUS_ZOOM,
  INITIAL_VIEW,
  LAYER_IDS,
  MAP_LOCALE,
  MAP_STYLE_URL,
  MIN_ZOOM,
} from "../mapConfig";
import {
  clearSelectedTripId,
  setSelectedTripId,
} from "../../trips/store/selectedTripIdSlice";
import { clearPolyline } from "../../../store/slices/polylineSlice";
import { useStack } from "../../../StackContext";
import type { RootState } from "../../../store/store";

// A MapLibre 6 bundlerrel nem találja meg magától a worker fájlt; így a
// webpack hash-elt assetként csomagolja és ezt az URL-t adja át.
setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString()
);

type HoveredFeature =
  | { layer: typeof LAYER_IDS.vehicles; tripId: string | number }
  | {
      layer: typeof LAYER_IDS.stops;
      name: string;
      coordinates: [number, number];
    };

const INTERACTIVE_LAYER_IDS = [LAYER_IDS.vehicles, LAYER_IDS.stops];

const VehicleMap = () => {
  const dispatch = useDispatch();
  const { push, pop } = useStack();
  const vehicles: any[] = useSelector(
    (state: RootState) => state.vehicles.vehicles
  );

  const isPanelOpen = useSelector((state: RootState) => state.panel.open);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // A kijelölés forrása a store: a keresésből és a térképről kijelölt járat is ide kerül.
  const popupTripId = useSelector(
    (state: RootState) => state.selectedTripId.tripId
  );
  const [hovered, setHovered] = useState<HoveredFeature | null>(null);

  const popupVehicle = vehicles.find(
    (vehicle) => vehicle.trip.id === popupTripId
  );
  const hoveredVehicle =
    hovered?.layer === LAYER_IDS.vehicles && hovered.tripId !== popupTripId
      ? vehicles.find((vehicle) => vehicle.trip.id === hovered.tripId)
      : undefined;

  const closeVehiclePopup = () => {
    pop();
    dispatch(clearSelectedTripId());
    dispatch(clearPolyline());
  };

  const openVehiclePopup = (vehicle: any, e: MapLayerMouseEvent) => {
    if (vehicle.trip.id === popupTripId) return;

    dispatch(setSelectedTripId(vehicle.trip.id));
    push({
      id: `trip-${vehicle.trip.id}`,
      component: <TripInformation />,
    });
    e.target.flyTo({ center: [vehicle.lon, vehicle.lat], duration: 500 });
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];

    if (feature?.layer.id === LAYER_IDS.vehicles) {
      const vehicle = vehicles.find(
        (vehicle) => vehicle.trip.id === feature.properties.tripId
      );
      if (vehicle) openVehiclePopup(vehicle, e);
      return;
    }
    // A kijelölést csak a felugró ablak X gombja vagy a "Vissza" szünteti meg,
    // a térkép üres részére kattintás nem.
  };

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];

    if (feature?.layer.id === LAYER_IDS.vehicles) {
      const tripId = feature.properties.tripId;
      setHovered((prev) =>
        prev?.layer === LAYER_IDS.vehicles && prev.tripId === tripId
          ? prev
          : { layer: LAYER_IDS.vehicles, tripId }
      );
    } else if (feature?.layer.id === LAYER_IDS.stops) {
      const name = feature.properties.name;
      setHovered((prev) =>
        prev?.layer === LAYER_IDS.stops && prev.name === name
          ? prev
          : {
              layer: LAYER_IDS.stops,
              name,
              coordinates: (feature.geometry as Point).coordinates as [
                number,
                number
              ],
            }
      );
    } else {
      setHovered(null);
    }
  };

  return (
    <div className="vehicle-map">
      <Map
        initialViewState={INITIAL_VIEW}
        minZoom={MIN_ZOOM}
        mapStyle={MAP_STYLE_URL}
        locale={MAP_LOCALE}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        maxPitch={0}
        interactiveLayerIds={INTERACTIVE_LAYER_IDS}
        cursor={hovered ? "pointer" : undefined}
        onLoad={(e) => {
          e.target.touchZoomRotate.disableRotation();
          registerVehicleIcons(e.target);
          localizeLabels(e.target);
          setIsMapLoaded(true);
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <MapFlyToController />
        <NavigationControl position="top-left" showCompass={false} />
        <GeolocateControl
          position="top-left"
          fitBoundsOptions={{ maxZoom: FOCUS_ZOOM, duration: 500 }}
          positionOptions={{ enableHighAccuracy: true }}
        />
        {/* A rétegek egyszerre, a betöltés után jönnek létre, így a sorrendjük
            (alulról felfelé: járatvonal, megállók, járművek) a JSX sorrendje. */}
        {isMapLoaded && (
          <>
            <TripPolyLine />
            <TrainStopMarkers />
          </>
        )}
        <VehicleMarkers isMapLoaded={isMapLoaded} />

        {/* Nyitott panelnél a járat adatai ott látszanak, a buborék csak zárt panelnél kell. */}
        {popupVehicle && !isPanelOpen && (
          <VehiclePopup vehicle={popupVehicle} onClose={closeVehiclePopup} />
        )}
        {hoveredVehicle && (
          <Popup
            longitude={hoveredVehicle.lon}
            latitude={hoveredVehicle.lat}
            anchor="bottom"
            offset={20}
            maxWidth="none"
            closeButton={false}
            closeOnClick={false}
            focusAfterOpen={false}
            className="tooltip SourceSans3"
          >
            <TripHeadSign trip={hoveredVehicle.trip} />
          </Popup>
        )}
        {hovered?.layer === LAYER_IDS.stops && (
          <Popup
            longitude={hovered.coordinates[0]}
            latitude={hovered.coordinates[1]}
            anchor="bottom"
            offset={12}
            maxWidth="none"
            closeButton={false}
            closeOnClick={false}
            focusAfterOpen={false}
            className="tooltip SourceSans3"
          >
            {hovered.name}
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default VehicleMap;
