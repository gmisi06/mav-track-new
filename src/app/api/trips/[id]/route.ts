import { getTripDetails } from '@/server/trips/trips.service';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const trip = await getTripDetails(id);
    if (!trip) {
      return Response.json(
        { statusCode: 404, message: 'Trip not found' },
        { status: 404 },
      );
    }
    return Response.json(trip);
  } catch (error) {
    console.error(error);
    return Response.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
