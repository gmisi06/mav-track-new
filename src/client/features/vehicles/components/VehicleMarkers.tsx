import { useEffect } from "react";
import { useGetVehiclesQuery } from "../api/vehiclesApiSlice";
import { useDispatch } from "react-redux";
import { setVehicles } from "../store/vehiclesSlice";
import VehicleMarker from "./VehicleMarker";
import MapOverlay from "./MapOverlay";

const VehicleMarkers = () => {
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

  if (isLoading || isError)
    return (
      <MapOverlay>
        {isLoading
          ? "Térkép betöltése..."
          : "Hiba történt az járművek lekérése közben..."}
      </MapOverlay>
    );

  if (!vehicles) return null;
  return (
    <>
      {vehicles.map((vehicle: any) => (
        <VehicleMarker key={vehicle.trip.id} vehicle={vehicle} />
      ))}
    </>
  );
};

export default VehicleMarkers;
