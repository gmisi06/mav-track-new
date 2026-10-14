import { PlaceReservationPossibility } from '@/server/enums/PlaceReservationPossibility.type';
import { Stop } from './Stop.type';
import { ComfortLevel } from './ComfortLevel.type';

export interface TripComfortLevel {
  placeReservation?: PlaceReservationPossibility;
  comfortLevel?: ComfortLevel;
  fromStop?: Stop;
  fromStopIndex?: number;
  tillStop?: Stop;
  tillStopIndex?: number;
}
