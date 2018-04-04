export interface IntegrityData {
  id: number;
  smiles: string;
  drug_name: string;
  phase: Array<string>;
  category: Array<string>;
  mechanism: Array<string>;
  ikey: string;
  wikidata: string;
  pubchem_cid: string;
}