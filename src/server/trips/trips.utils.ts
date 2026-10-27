import { TripEmma } from '@/server/types/TripEmma.type';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';
import { getVehicleType } from '../vehicles/vehicleType';

export function mergeTripWithVehicle(
  trip: TripEmma,
  vehiclePosition: VehiclePositionEmma,
) {
  const mergedTrip: TripEmma = {
    ...vehiclePosition.trip,
    infoServices: trip.infoServices,
    wheelchairAccessible: trip.wheelchairAccessible,
    bikesAllowed: trip.bikesAllowed,
    occupancy: trip.occupancy,
    availableComfortLevels: trip.availableComfortLevels,
    throughCoaches: trip.throughCoaches,
    pullingTrips: trip.pullingTrips,
    alerts: trip.alerts,
    stoptimes: trip.stoptimes,
    polyline: trip.polyline,
    vehicleType: getVehicleType(vehiclePosition.vehicleId),
    delay: vehiclePosition.delay,
    nextStop: vehiclePosition.stopRelationship.stop,
  };

  return mergedTrip;
}
