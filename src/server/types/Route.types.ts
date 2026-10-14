import { BikesAllowed } from '@/server/enums/BikesAllowed.enum';
import { Alert } from './Alert.type';
import { Stop } from './Stop.type';
import { TripEmma } from './TripEmma.type';
import { Pattern } from './Pattern.type';
import { TransitMode } from '@/server/enums/TransitMode.enum';
import { Agency } from './Ageny.type';

export interface Route {
  id?: string;
  gtfsId?: string;
  agency?: Agency;
  shortName?: string;
  longName?: string;
  mode?: TransitMode;
  type?: number;
  desc?: string;
  url?: string;
  color?: string;
  textColor?: string;
  bikesAllowed?: BikesAllowed;
  patterns?: Pattern[];
  stops?: Stop[];
  trips?: TripEmma[];
  alerts?: Alert[];
  sortOrder?: number;
  fontCharSet?: string;
  fontCode?: number;
}
