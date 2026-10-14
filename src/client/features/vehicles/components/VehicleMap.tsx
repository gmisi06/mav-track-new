import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type LatLngExpression } from "leaflet";

import TrainStopMarkers from "./VehicleStopMarkers";
import TripPolyLine from "../../trips/TripPolyLine";
import MapFlyToController from "../MapFlyToController";
import VehicleMarkers from "./VehicleMarkers";
import MapClickHandler from "../MapClickHandler";

const VehicleMap = () => {
  const position: LatLngExpression = [47.0956, 19.5063];

  return (
    <MapContainer
      className="leaflet-container"
      center={position}
      zoom={8}
      minZoom={8}
      scrollWheelZoom={true}
    >
      <MapClickHandler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapFlyToController />
      <TripPolyLine />
      <TrainStopMarkers />
      <VehicleMarkers />
    </MapContainer>
  );
};

export default VehicleMap;
