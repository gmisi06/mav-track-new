import { Stop } from './Stop.type';

export interface InfoService {
  name?: string;
  fromStop?: Stop;
  fromStopIndex?: number;
  tillStop?: Stop;
  tillStopIndex?: number;
  fontCharSet?: string;
  fontCode?: number;
  displayable?: boolean;

  // Saját adattag
  font?: string;
}
