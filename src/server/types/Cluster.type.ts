import { Stop } from './Stop.type';

export interface Cluster {
  id?: string;
  gtfsId?: string;
  name?: string;
  lat?: number;
  lon?: number;
  stops?: Stop[];
}
