import { describe, expect, it } from 'vitest';
import { getSecondsSinceMidnight, getServiceDay } from '../time';

describe('time', () => {
  it('a menetrendi napot magyar idő szerint adja (nyári idő, UTC éjfél előtt)', () => {
    // 2025-07-01 22:30 UTC = 2025-07-02 00:30 CEST
    const date = new Date('2025-07-01T22:30:00Z');
    expect(getServiceDay(date)).toBe('2025-07-02');
    expect(getSecondsSinceMidnight(date)).toBe(30 * 60);
  });

  it('téli időben is helyes', () => {
    // 2025-01-15 23:30 UTC = 2025-01-16 00:30 CET
    const date = new Date('2025-01-15T23:30:00Z');
    expect(getServiceDay(date)).toBe('2025-01-16');
  });
});
