export class SearchResult {
  data: Object;
  tabulatedData: Object;
  responseCode?: number;

  constructor(obj?: any) {
    this.data              = obj && obj.data             || null;
  }

}
