import { Agency } from './Ageny.type';
import { Route } from './Route.types';

export interface RouteType {
  routeType?: number;
  agency?: Agency;
  routes?: Route[];
}
