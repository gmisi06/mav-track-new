import { Route } from './Route.types';
import { Stop } from './Stop.type';

export interface StopOnRoute {
  stop?: Stop;
  route?: Route;
}
