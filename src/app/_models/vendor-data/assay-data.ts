export interface AssayData {
  chem_vendor?: string;
  chem_vendor_id?: string;
  ac50: number;
  activity_type: string;
  assay_id: string;
  assay_title: string;
  efficacy: number;
  ikey: string;
  indication: string;
  rsquared: number;
  smiles: string;
  title_short: string;
  wikidata: string;
  calibr_id?: string;
  name?: string;
  url?: string;
  r_sq?: number;
  assay_type?: string;
}

// For nesting; converts some of the fields to arrays and adds some additional fields
export interface AssayDataSets {
  ac50: number[];
  min: number;
  avg: number;
  count: number;
  efficacy: number[];
  r_squared: number[];
  id: string;
  main_label: string;
  qid: string;
  svg: string;
}

export interface NestedAssayData {
  key: string;
  values: NestedAssayValues[];
}

export interface NestedAssayValues {
  key: string;
  value: AssayDataSets;
}
