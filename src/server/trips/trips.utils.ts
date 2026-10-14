import { TripEmma } from '@/server/types/TripEmma.type';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';

export function mergeTripWithVehicle(
  trip: TripEmma,
  vehiclePosition: VehiclePositionEmma,
) {
  const mergedTrip: TripEmma = {
    ...vehiclePosition.trip,
    infoServices: trip.infoServices,
    alerts: trip.alerts,
    stoptimes: trip.stoptimes,
    polyline: trip.polyline,
    delay: vehiclePosition.delay,
    nextStop: vehiclePosition.stopRelationship.stop,
  };

  return mergedTrip;
}
