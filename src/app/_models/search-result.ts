export class SearchResult {
  data: Object;
  tabulatedData: Object;

  constructor(obj?: any) {
    this.data              = obj && obj.data             || null;

    console.log(this.data);
    // if(this.data){
    //   this.tabulatedData = this.processData(this.data);
    // }

    console.log(this.tabulatedData);

  }

  processData(raw_json: Object): Object {
    if(raw_json){

      let compounds: Array<Object> = [];
      for(let x of raw_json['results']['bindings']) {
        // console.log(x);

        compounds.push({
          'wd_id': x['c']['value'],
          'InChI Key': x['ikey']['value'],
          'name': x['cLabel']['value'],
          'chemspider': x['csid'] ? x['csid']['value'] : " ",
          'pubchem': x['cid'] ? x['cid']['value'] : " ",
        });
      }
      return compounds;
    }
    else {
      return {};
    }
  }
}