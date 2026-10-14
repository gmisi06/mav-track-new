import { Alert } from './Alert.type';
import { Coordinates } from './Coordinates.enum';
import { Geometry } from './Geometry.type';
import { Route } from './Route.types';
import { Stop } from './Stop.type';
import { TripEmma } from './TripEmma.type';
import { VehiclePositionEmma } from './VehiclePositionEmma.type';

export interface Pattern {
  id?: string;
  route?: Route;
  directionId?: number;
  name?: string;
  code?: string;
  headsign?: string;
  trips?: TripEmma[];
  tripsForDate?: TripEmma[];
  stops?: Stop[];
  geometry?: Coordinates[];
  patternGeometry?: Geometry;
  semanticHash?: string;
  alerts?: Alert[];
  vehiclePositions?: VehiclePositionEmma[];
  originalTripPattern?: Pattern;
  fromStopName?: string;
}
