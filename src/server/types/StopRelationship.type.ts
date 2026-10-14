import { VehicleStopStatus } from '@/server/enums/VehicleStopStatus.enum';
import { Stop } from './Stop.type';

export interface StopRelationship {
  status?: VehicleStopStatus;
  stop?: Stop;
  arrivalTime?: number;
  departureTime?: number;
}
