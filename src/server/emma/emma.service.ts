import {
  GTFS_VEHICLE_POSITIONS_QUERY,
  TRIP_DETAILS_QUERY,
  TRIP_POLYLINE_QUERY,
  VEHICLE_POSITIONS_QUERY,
} from './emma.queries';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';
import { TripEmma } from '@/server/types/TripEmma.type';
import { InfoService } from '@/server/types/InfoService.type';
import { getServiceDay } from '../time';
import {
  parseVehiclePositions,
  tripDetailsDataSchema,
  tripPolylineDataSchema,
  vehiclePositionsDataSchema,
} from './emma.schemas';
import type { ZodType } from 'zod';

const REQUEST_TIMEOUT_MS = 10_000;

const URL =
  'https://mavplusz.hu/otp2-backend/otp/routers/default/index/graphql';

async function sendQuery<T>(query: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(URL, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Origin: 'https://mavplusz.hu',
      Referer: 'https://mavplusz.hu/',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`EMMA HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(`EMMA GraphQL hiba: ${json.errors[0]?.message}`);
  }

  const parsed = schema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(`Váratlan EMMA válaszformátum: ${parsed.error.message}`);
  }
  return parsed.data;
}

async function fetchVehiclePositions(query: string) {
  const data = await sendQuery(query, vehiclePositionsDataSchema);
  const { valid, invalid } = parseVehiclePositions<VehiclePositionEmma>(
    data.vehiclePositions,
  );
  if (invalid > 0) {
    console.warn(`EMMA: ${invalid} érvénytelen jármű kihagyva`);
  }
  return valid;
}

function fontCodeToChar(code: number): string {
  return String.fromCharCode(code);
}

export function getVehiclePositionsFromEmma(): Promise<
  VehiclePositionEmma[]
> {
  return fetchVehiclePositions(VEHICLE_POSITIONS_QUERY);
}

export function getGtfsVehiclePositionsFromEmma(): Promise<
  VehiclePositionEmma[]
> {
  return fetchVehiclePositions(GTFS_VEHICLE_POSITIONS_QUERY);
}

export async function getTripDetailsFromEmma(
  tripId: string,
): Promise<TripEmma> {
  const data = await sendQuery(
    TRIP_DETAILS_QUERY(tripId, getServiceDay()),
    tripDetailsDataSchema,
  );
  const trip = data.trip as TripEmma;

  trip.infoServices = (trip.infoServices ?? []).map((infoService: InfoService) => ({
    ...infoService,
    font: fontCodeToChar(infoService.fontCode),
  }));

  return trip;
}

export async function getTripPolylineFromEmma(
  tripId: string,
): Promise<string> {
  const data = await sendQuery(
    TRIP_POLYLINE_QUERY(tripId, getServiceDay()),
    tripPolylineDataSchema,
  );
  return data.trip.tripGeometry.points;
}
