import { SalesService } from './SalesService.type';
import { StringI18n } from './StringI18n.type';

export interface SalesServiceGroup {
  salesGroupId?: number;
  salesGroupName?: string;
  salesGroupNameI18n?: StringI18n[];
  salesServices?: SalesService[];
}
