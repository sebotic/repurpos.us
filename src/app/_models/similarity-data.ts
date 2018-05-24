export interface SimilarityData {
     name: string;
     rfm_cmpd: boolean;
     assay_hits: boolean;
     gvk: boolean;
     integrity: boolean;
     informa: boolean;
     match_type: string;
     pubchem?: string;
     qid?: string;
     tanimoto?: number;
}
