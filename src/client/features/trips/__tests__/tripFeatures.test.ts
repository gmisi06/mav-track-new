import { describe, expect, it } from 'vitest';
import {
  accessibilityFeature,
  bikeFeature,
  occupancyLabel,
  reservationRows,
} from '../tripFeatures';

describe('tripFeatures', () => {
  it('ismeretlen vagy hiányzó adatnál nem mutat semmit', () => {
    expect(accessibilityFeature('NO_INFORMATION')).toBeNull();
    expect(accessibilityFeature(undefined)).toBeNull();
    expect(bikeFeature('NO_INFORMATION')).toBeNull();
    expect(occupancyLabel('NO_DATA_AVAILABLE')).toBeNull();
    expect(occupancyLabel(undefined)).toBeNull();
  });

  it('megkülönbözteti az engedélyezett és tiltott állapotot', () => {
    expect(bikeFeature('ALLOWED')?.label).toMatch(/szállítható/);
    expect(bikeFeature('NOT_ALLOWED')?.label).toMatch(/nem/);
    expect(accessibilityFeature('NOT_POSSIBLE')?.label).toMatch(/Nem/);
  });

  it('a kihasználtságot magyarul adja', () => {
    expect(occupancyLabel('FULL')).toBe('Megtelt');
  });

  it('a null availableComfortLevels nem okoz hibát', () => {
    expect(reservationRows(null)).toEqual([]);
  });

  it('csak a helyjegyes szakaszokat adja vissza', () => {
    const rows = reservationRows([
      { placeReservation: 'NOT_POSSIBLE', comfortLevel: { name: '2. osztály' } },
      {
        placeReservation: 'MANDATORY',
        comfortLevel: { name: '1. osztály' },
        fromStop: { name: 'A' },
        tillStop: { name: 'B' },
      },
    ]);
    expect(rows).toEqual([
      { name: '1. osztály', reservation: 'MANDATORY', from: 'A', till: 'B' },
    ]);
  });
});
