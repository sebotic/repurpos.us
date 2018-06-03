export interface SimilarityData {
     name: string;
     match_type: string;
     properties: Array<SimilarityProps>;
     pubchem_id?: string;
     url?: string;
     tanimoto?: number;
}

export interface SimilarityProps {
  name: string;
  value: boolean;
  tooltip?: string;
}
