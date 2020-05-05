import { MappedTerm } from './mapped-term';

export interface InformaData {
  drug_name: Array<string>;
  phase: Array<string>;
  highest_phase: string;
  mechanism: MappedTerm[]; // changed as of 2020-02-03
  smiles: string;
  ikey: string;
  wikidata: string;
  target_name?: Array<string>;
  target_family?: Array<string>;
  origin: string;
  cas_name: string;
  pubchem_cid?: string;
}
