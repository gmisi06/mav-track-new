import { transit_realtime } from 'gtfs-realtime-bindings';
import { getGtfsVehiclePositionsFromEmma } from '@/server/emma/emma.service';
import { VehiclePositionEmma } from '@/server/types/VehiclePositionEmma.type';
import { VehicleStopStatus } from '@/server/enums/VehicleStopStatus.enum';

// A GTFS-rt feedek szokásos frissítési ideje.
const CACHE_TTL_MS = 10 * 1000;

export interface VehiclePositionsFeed {
  message: transit_realtime.IFeedMessage;
  /** stop_id -> megállónév, csak a szöveges kimenet megjegyzéseihez. */
  stopNames: Map<string, string>;
}

let cachedFeed: VehiclePositionsFeed | null = null;
let lastFetch = 0;
let inflight: Promise<VehiclePositionsFeed> | null = null;

const STOP_STATUS: Record<
  VehicleStopStatus,
  transit_realtime.VehiclePosition.VehicleStopStatus
> = {
  [VehicleStopStatus.INCOMING_AT]:
    transit_realtime.VehiclePosition.VehicleStopStatus.INCOMING_AT,
  [VehicleStopStatus.STOPPED_AT]:
    transit_realtime.VehiclePosition.VehicleStopStatus.STOPPED_AT,
  [VehicleStopStatus.IN_TRANSIT_TO]:
    transit_realtime.VehiclePosition.VehicleStopStatus.IN_TRANSIT_TO,
};

/** Az OTP a GTFS azonosítókat "feedId:id" alakban adja, a statikus GTFS-ben csak az "id" szerepel. */
function stripFeedId(gtfsId?: string): string | undefined {
  if (!gtfsId) return undefined;
  const index = gtfsId.indexOf(':');
  return index === -1 ? gtfsId : gtfsId.slice(index + 1);
}

function toEntity(
  vehicle: VehiclePositionEmma,
  stopNames: Map<string, string>,
): transit_realtime.IFeedEntity | null {
  const vehicleId = stripFeedId(vehicle.vehicleId);
  if (!vehicleId || vehicle.lat == null || vehicle.lon == null) {
    return null;
  }

  const trip = vehicle.trip;
  const stop = vehicle.stopRelationship?.stop;
  const stopId = stripFeedId(stop?.gtfsId);
  if (stopId && stop?.name) {
    stopNames.set(stopId, stop.name);
  }

  return {
    id: `VehiclePosition-${vehicleId}`,
    vehicle: {
      trip: trip?.gtfsId
        ? {
            tripId: stripFeedId(trip.gtfsId),
            startDate: trip.serviceDate?.replaceAll('-', ''),
            scheduleRelationship:
              transit_realtime.TripDescriptor.ScheduleRelationship.SCHEDULED,
            routeId: stripFeedId(trip.route?.gtfsId),
          }
        : {},
      position: {
        latitude: vehicle.lat,
        longitude: vehicle.lon,
        bearing: vehicle.heading ?? undefined,
        speed: vehicle.speed ?? undefined,
      },
      currentStatus: STOP_STATUS[vehicle.stopRelationship?.status],
      timestamp: vehicle.lastUpdated,
      stopId,
      vehicle: {
        id: vehicleId,
        label: vehicle.label || trip?.tripHeadsign || undefined,
      },
    },
  };
}

async function refresh(): Promise<VehiclePositionsFeed> {
  const vehicles = await getGtfsVehiclePositionsFromEmma();

  // Egy jármű többször is szerepelhet, a legfrissebb pozíciót tartjuk meg.
  const latest = new Map<string, VehiclePositionEmma>();
  for (const vehicle of vehicles ?? []) {
    if (!vehicle?.vehicleId) continue;
    const existing = latest.get(vehicle.vehicleId);
    if (!existing || (vehicle.lastUpdated ?? 0) > (existing.lastUpdated ?? 0)) {
      latest.set(vehicle.vehicleId, vehicle);
    }
  }

  const stopNames = new Map<string, string>();
  const entity = Array.from(latest.values())
    .map((vehicle) => toEntity(vehicle, stopNames))
    .filter((entity) => entity !== null);

  cachedFeed = {
    message: {
      header: {
        gtfsRealtimeVersion: '2.0',
        incrementality: transit_realtime.FeedHeader.Incrementality.FULL_DATASET,
        timestamp: Math.floor(Date.now() / 1000),
      },
      entity,
    },
    stopNames,
  };
  lastFetch = Date.now();
  return cachedFeed;
}

export async function getVehiclePositionsFeed(): Promise<VehiclePositionsFeed> {
  if (cachedFeed && Date.now() - lastFetch < CACHE_TTL_MS) {
    return cachedFeed;
  }

  inflight ??= refresh().finally(() => {
    inflight = null;
  });

  try {
    return await inflight;
  } catch (error) {
    // Az EMMA hibája esetén a legutóbbi feedet adjuk vissza (a header.timestamp jelzi a korát).
    if (cachedFeed) {
      console.warn('EMMA nem elérhető, a korábbi feedet adjuk vissza', error);
      return cachedFeed;
    }
    throw error;
  }
}

/** Bináris protobuf kódolás – ezt várják a GTFS-rt kliensek. */
export function encodeFeed(feed: VehiclePositionsFeed): Uint8Array {
  return transit_realtime.FeedMessage.encode(feed.message).finish();
}

const toSnakeCase = (key: string) =>
  key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

const ENUM_FIELDS = new Set([
  'incrementality',
  'scheduleRelationship',
  'currentStatus',
  'congestionLevel',
  'occupancyStatus',
  'wheelchairAccessible',
]);

const COMMENT_COLUMN = 40;

function withComment(line: string, comment: string): string {
  return `${line.padEnd(COMMENT_COLUMN)}# ${comment}`;
}

function formatScalar(key: string, value: unknown): string {
  if (typeof value === 'string' && !ENUM_FIELDS.has(key)) {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' && !Number.isInteger(value)) {
    return String(value);
  }
  if (
    typeof value === 'number' &&
    ['bearing', 'speed', 'latitude', 'longitude'].includes(key)
  ) {
    return value.toFixed(1);
  }
  return String(value);
}

function printMessage(
  object: Record<string, unknown>,
  indent: string,
  stopNames: Map<string, string>,
  lines: string[],
) {
  for (const [key, value] of Object.entries(object)) {
    if (value == null) continue;
    const name = toSnakeCase(key);
    const items = Array.isArray(value) ? value : [value];

    for (const item of items) {
      if (typeof item === 'object') {
        lines.push(`${indent}${name} {`);
        printMessage(
          item as Record<string, unknown>,
          `${indent}  `,
          stopNames,
          lines,
        );
        lines.push(`${indent}}`);
        continue;
      }

      const line = `${indent}${name}: ${formatScalar(key, item)}`;
      if (key === 'timestamp') {
        lines.push(
          withComment(line, new Date(Number(item) * 1000).toISOString()),
        );
      } else if (key === 'stopId' && stopNames.has(String(item))) {
        lines.push(withComment(line, stopNames.get(String(item))));
      } else {
        lines.push(line);
      }
    }
  }
}

/** Protobuf text format (ember által olvasható, hibakereséshez). */
export function feedToText(feed: VehiclePositionsFeed): string {
  const object = transit_realtime.FeedMessage.toObject(
    transit_realtime.FeedMessage.fromObject(feed.message),
    { enums: String, longs: Number },
  );
  const lines: string[] = [];
  printMessage(object, '', feed.stopNames, lines);
  return `${lines.join('\n')}\n`;
}
