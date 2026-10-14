import { getVehiclePositionsFromEmma } from '../emma/emma.service';
import { transformEmmaVehiclePositions } from './vehicles.mapper';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';

const CACHE_TTL_MS = 3 * 60 * 1000;

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
  return inflight;
}

export function getVehicleByTripId(tripId: string): VehiclePositionEmma {
  return vehicleCache.get(tripId);
}
