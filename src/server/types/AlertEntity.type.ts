import { Agency } from './Ageny.type';
import { Pattern } from './Pattern.type';
import { Route } from './Route.types';
import { RouteType } from './RouteType.type';
import { Stop } from './Stop.type';
import { StopOnRoute } from './StopOnRoute.type';
import { StopOnTrip } from './StopOnTrip.type';
import { TripEmma } from './TripEmma.type';
import { Unknown } from './Unknown.type';

export type AlertEntity =
  | Agency
  | Route
  | Pattern
  | Stop
  | TripEmma
  | StopOnRoute
  | StopOnTrip
  | RouteType
  | Unknown;
