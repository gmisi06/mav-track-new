import { decode } from 'he';
import { Stoptime } from '@/server/types/Stoptime.type';
import { getSecondsSinceMidnight } from '../time';

export default function decodeRouteShortName(
  encodedRouteShortName: string,
): string {
  const match = encodedRouteShortName.match(/>([^<]+)</);
  return match ? decode(match[1]) : null;
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
