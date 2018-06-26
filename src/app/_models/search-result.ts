export class SearchResult {
  data: Object[];
  tabulatedData: Object;
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
