import { RealtimeState } from '@/server/enums/RealtimeState.enum';
import { Stop } from './Stop.type';
import { TripEmma } from './TripEmma.type';
import { PickupDropoffType } from '@/server/enums/PickupDropoffType.enum';

export interface Stoptime {
  stop?: Stop;
  stopPosition?: number;
  scheduledArrival?: number;
  realtimeArrival?: number;
  arrivalDelay?: number;
  scheduledDeparture?: number;
  realtimeDeparture?: number;
  departureDelay?: number;
  timepoint?: boolean;
  realtime?: boolean;
  realtimeState?: RealtimeState;
  pickupType?: PickupDropoffType;
  dropoffType?: PickupDropoffType;
  serviceDay?: number;
  trip?: TripEmma;
  headsign?: string;
  platformColor?: string;
}
