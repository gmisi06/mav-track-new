import { decode } from 'he';
import { Stoptime } from '@/server/types/Stoptime.type';
import { getSecondsSinceMidnight } from '../time';

export default function decodeRouteShortName(
  encodedRouteShortName: string,
): string {
  if (!encodedRouteShortName) return null;
  // Lehet HTML-be csomagolt ("<span ...>&#366;</span>") vagy sima szöveg ("1045").
  const match = encodedRouteShortName.match(/>([^<]+)</);
  return decode((match ? match[1] : encodedRouteShortName).trim());
}

export function getCurrentTripDelay(stoptimes: Stoptime[]) {
  let currentStoptime: any;

  const secondsSinceMidnight = getSecondsSinceMidnight();

  for (const stoptime of stoptimes) {
    if (stoptime.realtimeArrival > secondsSinceMidnight) {
      currentStoptime = stoptime;
      break;
    }
  }

  return currentStoptime ? currentStoptime.arrivalDelay : null;
}

/** A rövid név HTML-be csomagolt (pl. ikon-karakter a MNR2007 betűtípushoz)? */
export function isRouteShortNameHtml(routeShortName: string | null | undefined) {
  return !!routeShortName && /<[^>]+>/.test(routeShortName);
}
