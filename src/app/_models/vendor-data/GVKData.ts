import { MappedTerm } from './mapped-term';

export interface GVKData {
  hvac_id?: string;
  gvk_id: number;
  drug_name: string[]; // changed as of 2020-02-03
  phase: Array<string>;
  roa: Array<string>;
  category: MappedTerm[]; // changed as of 2020-02-03
  mechanism: MappedTerm[]; // changed as of 2020-02-03
  smiles: string;
  synonyms: Array<string>;
  ikey: string;
}
