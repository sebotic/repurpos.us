import { MappedTerm } from './mapped-term';

export interface IntegrityData {
  id: number;
  smiles: string;
  drug_name: string[]; // changed as of 2020-02-03
  phase: Array<string>;
  category: MappedTerm[]; // changed as of 2020-02-03
  mechanism: MappedTerm[]; // changed as of 2020-02-03
  ikey: string;
  wikidata: string;
  pubchem_cid?: string;
}
