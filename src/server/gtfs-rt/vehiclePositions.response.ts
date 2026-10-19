import {
  encodeFeed,
  feedToText,
  getVehiclePositionsFeed,
} from './vehiclePositions.service';

// A Vercel CDN 10 mp-ig cache-eli a választ, így az EMMA-t legfeljebb ennyi időnként kérdezzük le.
const CACHE_CONTROL = 'public, max-age=0, s-maxage=10, stale-while-revalidate=10';

export async function vehiclePositionsResponse(asText: boolean) {
  try {
    const feed = await getVehiclePositionsFeed();

    if (asText) {
      return new Response(feedToText(feed), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': CACHE_CONTROL,
        },
      });
    }

    return new Response(Buffer.from(encodeFeed(feed)), {
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Bad gateway', { status: 502 });
  }
}
