import { describe, expect, it } from 'vitest';
import { getLastPassedIndex } from '../vehicleProgress';

const stoptimes = ['a', 'b', 'c', 'd'].map((id) => ({ stop: { id } }));

describe('getLastPassedIndex', () => {
  it('a következő megálló előtti megállót adja', () => {
    expect(getLastPassedIndex(stoptimes, { id: 'c' })).toBe(1);
  });

  it('-1, ha a vonat még az első megállóhoz tart vagy nincs adat', () => {
    expect(getLastPassedIndex(stoptimes, { id: 'a' })).toBe(-1);
    expect(getLastPassedIndex(stoptimes, null)).toBe(-1);
    expect(getLastPassedIndex(undefined, { id: 'a' })).toBe(-1);
  });
});
