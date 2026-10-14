import {
  TRIP_DETAILS_QUERY,
  TRIP_POLYLINE_QUERY,
  VEHICLE_POSITIONS_QUERY,
} from './emma.queries';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';
import { TripEmma } from '@/server/types/TripEmma.type';
import { InfoService } from '@/server/types/InfoService.type';
import { getServiceDay } from '../time';

const URL =
  'https://mavplusz.hu/otp2-backend/otp/routers/default/index/graphql';

async function sendQuery<T>(query: string): Promise<T> {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      cache: 'no-store',
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
    return json.data;
  } catch (error) {
    console.error('HTTP hiba a lekérdezés során', error);
    throw error;
  }
}

function fontCodeToChar(code: number): string {
  return String.fromCharCode(code);
}

export async function getVehiclePositionsFromEmma(): Promise<
  VehiclePositionEmma[]
> {
  const data = await sendQuery<{ vehiclePositions: VehiclePositionEmma[] }>(
    VEHICLE_POSITIONS_QUERY,
  );
  return data.vehiclePositions;
}

export async function getTripDetailsFromEmma(
  tripId: string,
): Promise<TripEmma> {
  const data = await sendQuery<{ trip: TripEmma }>(
    TRIP_DETAILS_QUERY(tripId, getServiceDay()),
  );
  const trip = data.trip;

  trip.infoServices = trip.infoServices.map((infoService: InfoService) => ({
    ...infoService,
    font: fontCodeToChar(infoService.fontCode),
  }));

  return trip;
}

export async function getTripPolylineFromEmma(
  tripId: string,
): Promise<string> {
  const data = await sendQuery<any>(
    TRIP_POLYLINE_QUERY(tripId, getServiceDay()),
  );
  return data.trip.tripGeometry.points;
}
