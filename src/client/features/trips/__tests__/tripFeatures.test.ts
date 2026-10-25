import { describe, expect, it } from 'vitest';
import { occupancyLabel, reservationRows } from '../tripFeatures';

describe('tripFeatures', () => {
  it('ismeretlen vagy hiányzó adatnál nem mutat semmit', () => {
    expect(occupancyLabel('NO_DATA_AVAILABLE')).toBeNull();
    expect(occupancyLabel(undefined)).toBeNull();
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
