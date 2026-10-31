import { EmmaHttpError } from '@/server/emma/emma.service';
import {
  getVehicleDataAgeSeconds,
  getVehiclePositions,
} from '@/server/vehicles/vehicles.service';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// A Vercel CDN 30 mp-ig cache-eli a választ, hiba esetén további 30 mp-ig elavult adatot is kiszolgálhat.
const CACHE_CONTROL =
  'public, max-age=0, s-maxage=30, stale-while-revalidate=30, stale-if-error=300';

export async function GET() {
  try {
    const vehicles = await getVehiclePositions();
    return Response.json(vehicles, {
      headers: {
        'Cache-Control': CACHE_CONTROL,
        'X-Data-Age': String(getVehicleDataAgeSeconds() ?? 0),
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof EmmaHttpError) {
      const blocked = error.status === 403 || error.status === 429;
      return Response.json(
        {
          statusCode: 502,
          message: blocked
            ? 'A MÁV szervere letiltotta/korlátozta a kérést (túl sok kérés vagy tiltott IP).'
            : `A MÁV szervere hibát adott (HTTP ${error.status}).`,
          upstreamStatus: error.status,
        },
        { status: 502 },
      );
    }
    return Response.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
