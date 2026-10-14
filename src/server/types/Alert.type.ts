import { AlertCauseType } from '@/server/enums/AlertCauseType.enum';
import { AlertEffectType } from '@/server/enums/AlertEffectType.enum';
import { AlertSeverityLevelType } from '@/server/enums/AlertSeverityLevelType.enum';
import { AlertEntity } from './AlertEntity.type';

export interface Alert {
  id?: string;
  alertHash?: number;
  feed?: string;
  alertHeaderText?: string;
  alertHeaderTextTranslations?: any[];
  alertDescriptionText?: string;
  alertDescriptionTextTranslations?: any[];
  alertUrl?: string;
  alertUrlTranslations?: any[];
  alertEffect?: AlertEffectType;
  alertCause?: AlertCauseType;
  alertSeverityLevel?: AlertSeverityLevelType;
  effectiveStartDate?: number;
  effectiveEndDate?: number;
  entities?: AlertEntity[];
}
