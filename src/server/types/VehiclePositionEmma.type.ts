import { StopRelationship } from './StopRelationship.type';
import { Stoptime } from './Stoptime.type';
import { TripEmma } from './TripEmma.type';

export interface VehiclePositionEmma {
  vehicleId?: string;
  label?: string;
  lat?: number;
  lon?: number;
  stopRelationship?: StopRelationship;
  speed?: number;
  heading?: number;
  lastUpdated?: number;
  trip?: TripEmma;
  prevOrCurrentStop?: Stoptime;
  nextStop?: Stoptime;

  // Saját:
  delay: number;
}
