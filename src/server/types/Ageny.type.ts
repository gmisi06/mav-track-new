import { Alert } from './Alert.type';
import { Route } from './Route.types';

export interface Agency {
  id?: string;
  gtfsId?: string;
  name?: string;
  url?: string;
  timezone?: string;
  lang?: string;
  phone?: string;
  fareUrl?: string;
  routes?: Route[];
  alerts?: Alert[];
  uicCode?: string;
}
