import { getVehiclePositions } from '@/server/vehicles/vehicles.service';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  try {
    return Response.json(await getVehiclePositions());
  } catch (error) {
    console.error(error);
    return Response.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
