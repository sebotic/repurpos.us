import { GVKData, IntegrityData, InformaData, AssayData } from './index';


export interface VendorData extends Array<GVKData | IntegrityData | InformaData> {
  0: GVKData;
  1: IntegrityData;
  2: InformaData;
 }

  // // ikey: string;
  // gvk: GVKData;
  // integrity: IntegrityData;
  // informa: InformaData;
  // assay: Array<AssayData>;
// }
