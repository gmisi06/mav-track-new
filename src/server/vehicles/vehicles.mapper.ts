import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';
import decodeRouteShortName, { getCurrentTripDelay } from './vehicles.utils';

export function transformEmmaVehiclePositions(
  vehiclesResponse: VehiclePositionEmma[],
) {
  const vehicles: Map<string, VehiclePositionEmma> = new Map<
    string,
    VehiclePositionEmma
  >();

  let id = 0;

  vehiclesResponse
    .filter(
      (vehicleResponse: VehiclePositionEmma) =>
        vehicleResponse && vehicleResponse.stopRelationship != null,
    )
    .map((vehicleResponse: VehiclePositionEmma) => {
      const vehicle = {
        id,
        vehicleId: vehicleResponse.vehicleId,
        lat: vehicleResponse.lat,
        lon: vehicleResponse.lon,
        heading: vehicleResponse.heading,
        lastUpdated: vehicleResponse.lastUpdated,
        speed: vehicleResponse.speed,
        stopRelationship: vehicleResponse.stopRelationship,
        trip: {
          id: vehicleResponse.trip.gtfsId,
          routeShortName: decodeRouteShortName(
            vehicleResponse.trip.routeShortName,
          ),
          tripHeadsign: vehicleResponse.trip.tripHeadsign,
          tripShortName: vehicleResponse.trip.tripShortName,
          route: {
            mode: vehicleResponse.trip.route.mode,
            longName: vehicleResponse.trip.route.longName,
            textColor: vehicleResponse.trip.route.textColor,
            color: vehicleResponse.trip.route.color,
          },
        },
        delay: getCurrentTripDelay(vehicleResponse.trip.stoptimes),
      };
      const existing = vehicles.get(vehicle.trip.id);

      if (!existing || vehicle.lastUpdated > existing.lastUpdated) {
        vehicles.set(vehicle.trip.id, vehicle);
        id++;
      }
    });

  return vehicles;
}
