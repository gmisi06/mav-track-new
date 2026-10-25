import {
  getTripDetailsFromEmma,
  getTripPolylineFromEmma,
} from '../emma/emma.service';
import { TripEmma } from '@/server/types/TripEmma.type';
import {
  getVehicleByTripId,
  getVehiclePositions,
} from '../vehicles/vehicles.service';
import { mergeTripWithVehicle } from './trips.utils';

const MAX_CACHE_AGE = 60 * 1000;

const tripsCache = new Map<string, { data: TripEmma; lastUpdated: number }>();

/** Visszatér a járat adataival, vagy null-lal, ha a járat nem közlekedik. */
export async function getTripDetails(tripId: string) {
  // Hideg indításnál a jármű-cache üres, ezért biztosítjuk, hogy betöltődjön.
  await getVehiclePositions();

  const vehiclePosition = getVehicleByTripId(tripId);
  if (!vehiclePosition) {
    return null;
  }

  const trip = tripsCache.get(tripId);
  const now = Date.now();

  if (trip && now - trip.lastUpdated < MAX_CACHE_AGE) {
    return mergeTripWithVehicle(trip.data, vehiclePosition);
  }

  try {
    const [freshTrip, polyline] = await Promise.all([
      getTripDetailsFromEmma(tripId),
      getTripPolylineFromEmma(tripId),
    ]);
    freshTrip.polyline = polyline;

    tripsCache.set(tripId, { data: freshTrip, lastUpdated: now });

    return mergeTripWithVehicle(freshTrip, vehiclePosition);
  } catch (error) {
    // Elavult részletek még mindig jobbak, mint a hiba (a késés és a pozíció friss marad).
    if (trip) {
      console.warn(`Járat (${tripId}) frissítése sikertelen, cache-t adunk`, error);
      return mergeTripWithVehicle(trip.data, vehiclePosition);
    }
    throw error;
  }
}
