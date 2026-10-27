import { afterEach, describe, expect, it, vi } from 'vitest';
import decodeRouteShortName, {
  getCurrentTripDelay,
} from '../vehicles/vehicles.utils';
import { transformEmmaVehiclePositions } from '../vehicles/vehicles.mapper';

afterEach(() => vi.useRealTimers());

describe('decodeRouteShortName', () => {
  it('sima szöveget (pl. 1045) változatlanul visszaad', () => {
    expect(decodeRouteShortName('1045')).toBe('1045');
    expect(decodeRouteShortName(undefined as unknown as string)).toBeNull();
  });

  it('kinyeri a HTML-ből a szöveget és dekódolja az entitásokat', () => {
    expect(decodeRouteShortName('<span class="x">&#xE001;</span>')).toBe(
      '',
    );
  });

});

describe('getCurrentTripDelay', () => {
  it('az első még meg nem érkezett megálló késését adja', () => {
    vi.useFakeTimers();
    // 10:00 magyar idő (CEST) = 08:00 UTC
    vi.setSystemTime(new Date('2025-07-01T08:00:00Z'));
    const stoptimes: any[] = [
      { realtimeArrival: 9 * 3600, arrivalDelay: 60 },
      { realtimeArrival: 11 * 3600, arrivalDelay: 300 },
      { realtimeArrival: 12 * 3600, arrivalDelay: 600 },
    ];
    expect(getCurrentTripDelay(stoptimes)).toBe(300);
  });

  it('null-t ad, ha a járat már minden megállót elhagyott', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-01T20:00:00Z'));
    expect(
      getCurrentTripDelay([{ realtimeArrival: 3600, arrivalDelay: 0 } as any]),
    ).toBeNull();
  });
});

const vehicle = (over: Record<string, any> = {}): any => ({
  lat: 47,
  lon: 19,
  heading: 90,
  speed: 20,
  lastUpdated: 100,
  stopRelationship: { status: 'IN_TRANSIT_TO', stop: { id: 's' } },
  trip: {
    gtfsId: '1:10',
    routeShortName: '<b>IC</b>',
    tripHeadsign: 'Pécs',
    tripShortName: '123',
    route: { mode: 'RAIL', longName: 'x', textColor: 'fff', color: '000' },
    stoptimes: [],
  },
  ...over,
});

describe('transformEmmaVehiclePositions', () => {
  it('kiszűri a megálló-kapcsolat nélküli járműveket', () => {
    const result = transformEmmaVehiclePositions([
      vehicle({ stopRelationship: null }),
    ]);
    expect(result.size).toBe(0);
  });

  it('jelzi, ha a rövid név HTML-be csomagolt (ikon-betűtípus)', () => {
    const html = transformEmmaVehiclePositions([vehicle()]).get('1:10');
    expect(html?.trip.routeShortNameIsFont).toBe(true);
    const plain = transformEmmaVehiclePositions([
      vehicle({ trip: { ...vehicle().trip, routeShortName: '1184' } }),
    ]).get('1:10');
    expect(plain?.trip.routeShortNameIsFont).toBe(false);
  });

  it('járatonként a legfrissebb pozíciót tartja meg', () => {
    const result = transformEmmaVehiclePositions([
      vehicle({ lastUpdated: 100, lat: 1 }),
      vehicle({ lastUpdated: 200, lat: 2 }),
      vehicle({ lastUpdated: 150, lat: 3 }),
    ]);
    expect(result.size).toBe(1);
    expect(result.get('1:10')?.lat).toBe(2);
  });
});
