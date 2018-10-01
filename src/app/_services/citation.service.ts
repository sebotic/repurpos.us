import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})


export class CitationService {
  entrez_stub = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
  // ex: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=18579783&retmode=xml&rettype=abstract
  ncbi_stub = 'https://www.ncbi.nlm.nih.gov/pmc/utils/ctxp';
  // ex https://www.ncbi.nlm.nih.gov/pmc/utils/ctxp?ids=PMC2440361&report=citeproc';
  citations: Object[] = [];
  result = [];

  constructor(private http: HttpClient) { }

  getCitation(pmids: string[]) {
    let promises = [];
    for (let pmid of pmids) {
      let promise = this.getNCBI(pmid);
      promises.push(promise)
    }

    return Promise.all(promises).then(_ => this.citations)
  }

  // getEntrez(pmid: string): void {
  //   console.log('calling NCBI')
  //   this.http.get(this.entrez_stub, {
  //     observe: 'response',
  //     responseType: 'text',
  //     headers: new HttpHeaders(),
  //     // .set('Accept', 'text'),
  //     // .set('Authorization', localStorage.getItem('auth_token')),
  //     params: new HttpParams()
  //       .set('db', 'pubmed')
  //       .set('id', pmid)
  //       .set('retmode', 'text')
  //       .set('rettype', 'abstract')
  //   }).subscribe((r) => {
  //     console.log(r);
  //     let v = r.body;
  //     // console.log('structure returned from service');
  //     console.log(v);
  //
  //   },
  //     err => {
  //       console.log('err in call to NCBI')
  //       console.log(err)
  //     }
  //   );
  // }
  //

  getNCBI(pmid: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('calling NCBI')
      // console.log(pmid)
      this.http.get(this.ncbi_stub, {
        observe: 'response',
        responseType: 'json',
        headers: new HttpHeaders(),
        params: new HttpParams()
          .set('ids', pmid)
          .set('report', 'citeproc')
      }).subscribe((r) => {
        // console.log(r);
        let v = r.body;
        this.citations.push(v);
        // console.log(this.citations)
        resolve(this.citations)
      },
        err => {
          console.log('err in call to NCBI')
          console.log(err)
          resolve("Error in call to get citation")
        });
    })
  }
}
