import { Stop } from './Stop.type';
import { TripEmma } from './TripEmma.type';

export interface TripConnection {
  trip?: TripEmma;
  attachedFromStop?: Stop;
  attachedTillStop?: Stop;
  serviceDateDayChange?: number;
  hybridTrain?: boolean;
}
