import { PricingAreaType } from '@/server/enums/PricingAreaType.enum';
import { ComfortLevelBenefits } from './ComfortLevelBenefits.type';
import { StringI18n } from './StringI18n.type';

export interface ComfortLevel {
  fareUicCode?: string;
  name?: string;
  nameI18n?: StringI18n[];
  listOrder?: number;
  mandatoryPlaceReservation?: boolean;
  pricingArea?: PricingAreaType;
  benefits?: ComfortLevelBenefits[];
  fontCharset?: string;
  fontCode?: number;
  description?: string;
  descriptionI18N?: StringI18n[];
}
