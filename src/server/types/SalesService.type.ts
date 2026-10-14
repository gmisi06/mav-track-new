import { PricingAreaType } from '@/server/enums/PricingAreaType.enum';
import { ComfortLevel } from './ComfortLevel.type';
import { StringI18n } from './StringI18n.type';
import { SalesServiceGroup } from './SalesServiceGroup.type';
import { TypeOfPrice } from '@/server/enums/TypeOfPrice.enum';

export interface SalesService {
  name?: string;
  nameI18n?: StringI18n[];
  code?: number;
  perTripPriced?: boolean;
  mainGroupWeight?: number;
  pricingArea?: PricingAreaType;
  classId?: number;
  classCode?: string;
  className?: string;
  listOrder?: number;
  mandatoryPlaceReservation?: boolean;
  salesServiceGroup?: SalesServiceGroup;
  productType?: TypeOfPrice;
  comfortLevel?: ComfortLevel;
}
