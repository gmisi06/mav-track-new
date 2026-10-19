import { vehiclePositionsResponse } from '@/server/gtfs-rt/vehiclePositions.response';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/** Ugyanaz a feed protobuf text formatban (mint a BKK `VehiclePositions.txt`). */
export async function GET() {
  return vehiclePositionsResponse(true);
}
