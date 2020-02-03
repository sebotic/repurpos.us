import { GVKData, IntegrityData, InformaData } from './index';


export interface VendorData extends Array<GVKData[] | IntegrityData[] | InformaData[]> {
  0: GVKData[];
  1: IntegrityData[];
  2: InformaData[];
 }
