import { PlaceReservationPossibility } from '@/server/enums/PlaceReservationPossibility.type';
import { Stop } from './Stop.type';
import { SalesService } from './SalesService.type';

export interface TripSalesService {
  mandatory?: boolean;
  placeReservation?: PlaceReservationPossibility;
  salesService?: SalesService;
  fromStop?: Stop;
  fromStopIndex?: number;
  tillStop?: Stop;
  tillStopIndex?: number;
}
