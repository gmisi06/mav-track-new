import { Stop } from './Stop.type';
import { TripEmma } from './TripEmma.type';

export interface StopOnTrip {
  stop?: Stop;
  trip?: TripEmma;
}
