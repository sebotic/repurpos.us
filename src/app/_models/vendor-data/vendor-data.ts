import { GVKData, IntegrityData, InformaData, AssayData } from './index';

export interface VendorData {
  ikey: string;
  gvk: GVKData;
  integrity: IntegrityData;
  informa: InformaData;
  assay: Array<AssayData>;
}