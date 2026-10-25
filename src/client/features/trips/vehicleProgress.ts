/**
 * Annak a megállónak az indexe, amelyet a vonat utoljára elhagyott
 * (a következő megálló előtti). -1, ha még nem indult el vagy nincs adat.
 */
export function getLastPassedIndex(
  stoptimes: { stop: { id: string } }[] | undefined,
  nextStop: { id: string } | undefined | null
): number {
  if (!stoptimes || !nextStop) return -1;
  return stoptimes.findIndex(
    (_, index) =>
      index < stoptimes.length - 1 &&
      stoptimes[index + 1].stop.id === nextStop.id
  );
}
