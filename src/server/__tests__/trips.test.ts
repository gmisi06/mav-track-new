import { describe, expect, it } from 'vitest';
import { mergeTripWithVehicle } from '../trips/trips.utils';
import {
  parseVehiclePositions,
  tripDetailsDataSchema,
} from '../emma/emma.schemas';

describe('mergeTripWithVehicle', () => {
  it('átveszi a járat részleteit, köztük az új szolgáltatás-mezőket', () => {
    const trip: any = {
      infoServices: [],
      alerts: [],
      stoptimes: [],
      polyline: 'abc',
      wheelchairAccessible: 'POSSIBLE',
      bikesAllowed: 'ALLOWED',
      occupancy: { occupancyStatus: 'EMPTY' },
      availableComfortLevels: [{}],
      throughCoaches: [{}],
      pullingTrips: [{}],
    };
    const vehicle: any = {
      trip: { id: '1' },
      delay: 120,
      stopRelationship: { stop: { id: 'next' } },
    };
    const merged = mergeTripWithVehicle(trip, vehicle);

    expect(merged.wheelchairAccessible).toBe('POSSIBLE');
    expect(merged.bikesAllowed).toBe('ALLOWED');
    expect(merged.occupancy?.occupancyStatus).toBe('EMPTY');
    expect(merged.throughCoaches).toHaveLength(1);
    expect(merged.pullingTrips).toHaveLength(1);
    expect(merged.availableComfortLevels).toHaveLength(1);
    expect(merged.delay).toBe(120);
    expect(merged.nextStop).toEqual({ id: 'next' });
  });
});

describe('EMMA sémák', () => {
  it('a hibás járműveket kihagyja, a többit megtartja', () => {
    const good = {
      vehicleId: 'v',
      lat: 1,
      lon: 2,
      trip: { gtfsId: '1:1' },
      extra: true,
    };
    const { valid, invalid } = parseVehiclePositions([
      good,
      { vehicleId: 'x', lat: 'nem szám', lon: 2, trip: { gtfsId: '1:2' } },
      null,
    ]);
    expect(valid).toHaveLength(1);
    expect(valid[0]).toMatchObject({ extra: true });
    expect(invalid).toBe(2);
  });

  it('elutasítja a megállók nélküli járatot', () => {
    expect(tripDetailsDataSchema.safeParse({ trip: {} }).success).toBe(false);
    expect(tripDetailsDataSchema.safeParse({ trip: null }).success).toBe(false);
  });
});
