import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable, forkJoin, of } from 'rxjs';
import { tap, map, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class CitationService {
  reframe_pmid: string = "30282735";

  entrez_stub = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
  // ex: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=18579783&retmode=xml&rettype=abstract
  ncbi_stub = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/';
  // ex: https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=30282735

  // DEAD as of November 2018: 'https://www.ncbi.nlm.nih.gov/pmc/utils/ctxp';


  // https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=30282735 ??
  // ex https://www.ncbi.nlm.nih.gov/pmc/utils/ctxp?ids=PMC2440361&report=citeproc';
  // NOTE: only works if PMID also has PMCID (grr)
  citations: Object[] = [];
  result = [];

  constructor(private http: HttpClient) { }

  getCitation(pmids: string[]): Observable<Object[]> {
    if (pmids && pmids.length > 0 && pmids[0]) {
      return forkJoin(pmids.map(d => this.getNCBI(d)));
    } else {
      return of([]);
    }
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


  // Ex: https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=30282735
  getNCBI(pmid: string): Observable<Object[]> {
    return this.http.get(this.ncbi_stub, {
      observe: 'response',
      responseType: 'json',
      headers: new HttpHeaders(),
      params: new HttpParams()
        .set('id', pmid)
        .set('format', 'csl')
    }).pipe(
      pluck("body"))
  }
}
