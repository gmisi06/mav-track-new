import { vehiclePositionsResponse } from '@/server/gtfs-rt/vehiclePositions.response';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/** Bináris protobuf; `?format=text` (vagy `?debug`) esetén protobuf text format. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  return vehiclePositionsResponse(
    params.get('format') === 'text' || params.has('debug'),
  );
}
