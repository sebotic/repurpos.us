export class SearchResult {
  data: Compound[];
  // tabulatedData: Object;
  status?: number;
  url?: string;

  constructor(obj?: any) {
    if (obj.data) {
      this.data = obj.data['body']['results'];
      this.status = obj.data.status || null;
      this.url = obj.data.url || null;
    } else {
      this.data = null;
      this.status = obj.status || null;
      this.url = obj.url || null;
    }
  }

}

export interface Compound {
  id: string;
  main_label: string;
  assay_types: string[];
  aliases: string[];
  assays: number;
  smiles: string;
  properties: AvailableData[];
  similar_compounds?: SimilarCompound[];
  tanimoto: number;
  reframeid?: any;
  qid?: string;
}

export interface AvailableData {
  name: string;
  value: boolean;
  tooltip?: string;
}

export interface SimilarCompound {
  compound_id: string;
  main_label: string;
  score: number;
  qid?: string;
}
