import { getVehiclePositionsFromEmma } from '../emma/emma.service';
import { transformEmmaVehiclePositions } from './vehicles.mapper';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';

// Egyezik a CDN (s-maxage=30) és a kliens (30 mp-es polling) frissítési idejével.
const CACHE_TTL_MS = 30 * 1000;

// Az adatok a (meleg) szerverless példány memóriájában cache-elődnek.
let vehicleCache = new Map<string, VehiclePositionEmma>();
let lastVehicleFetch = 0;
let inflight: Promise<VehiclePositionEmma[]> | null = null;

async function refresh(): Promise<VehiclePositionEmma[]> {
  const emmaResponse = await getVehiclePositionsFromEmma();

  const transformed = transformEmmaVehiclePositions(emmaResponse);
  if (!(transformed instanceof Map)) {
    throw new Error('Invalid vehicle data format');
  }

  vehicleCache = transformed;
  lastVehicleFetch = Date.now();

  const vehicles = Array.from(vehicleCache.values());
  console.log(`Lekérdezés frissítve, ${vehicles.length} jármű`);
  return vehicles;
}

export async function getVehiclePositions(): Promise<VehiclePositionEmma[]> {
  const cacheIsValid = Date.now() - lastVehicleFetch < CACHE_TTL_MS;

  if (cacheIsValid && vehicleCache.size > 0) {
    return Array.from(vehicleCache.values());
  }

  inflight ??= refresh().finally(() => {
    inflight = null;
  });

  try {
    return await inflight;
  } catch (error) {
    // Az EMMA hibája esetén a legutóbbi adatot szolgáljuk ki, ahelyett hogy hibát adnánk.
    if (vehicleCache.size > 0) {
      console.warn('EMMA nem elérhető, a korábbi adatot adjuk vissza', error);
      return Array.from(vehicleCache.values());
    }
    throw error;
  }
}

/** A jármű-adatok életkora másodpercben (cache nélkül null). */
export function getVehicleDataAgeSeconds(): number | null {
  return lastVehicleFetch
    ? Math.round((Date.now() - lastVehicleFetch) / 1000)
    : null;
}

export function getVehicleByTripId(tripId: string): VehiclePositionEmma {
  return vehicleCache.get(tripId);
}
