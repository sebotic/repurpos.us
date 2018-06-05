import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { flatMap, map } from 'rxjs/operators';

import { SearchResult } from '../_models/index';

@Injectable()
export class WDQService {
  apiUrl: string;
  q: string;

  constructor(public http: HttpClient

  ) {
    this.apiUrl = 'https://query.wikidata.org/sparql';

  }

  search(query: string): Observable<SearchResult[]> {
    // this.q = `SELECT * WHERE {?c wdt:P235 '${query}' .}`;

    this.q = query;
    if(!this.q){
      this.q = ''
    }

    // this.q = `SELECT * WHERE {?c wdt:P235 ?ikey . FILTER (STRSTARTS(?ikey, '${query}'))}`;

    console.log(this.q);

    let params: string = [
      `query=${this.q}`,
      `format=json`
    ].join('&');
    let queryUrl: string = encodeURI(`${this.apiUrl}?${params}`);

    console.log(queryUrl);

    return this.http.get(queryUrl).pipe(
      map(item => {
          return [new SearchResult({ data: item })];
        }));
  }

  searchFullText(query: string, sparql: string): Observable<SearchResult[]> {
    // this.q = query;
    let url: string = 'https://www.wikidata.org/w/api.php';

    console.log(query);

    let params: string = [
      'action=wbsearchentities',
      `search=${query}`,
      'language=en',
      'type=item',
      `format=json`,
      'origin=*' // required for Wikidata CORS, see https://www.wikidata.org/wiki/Special:ApiSandbox#action=query&meta=siteinfo&siprop=namespaces&format=json
    ].join('&');
    let queryUrl: string = encodeURI(`${url}?${params}`);

    console.log(queryUrl);

    let freetext_search = this.http.get(queryUrl).pipe(
      map(item => {
        return item['search'].map(x => {
          // console.log(x);
          return x['id'];
        }).join(' wd:')
      }));


    return freetext_search.pipe(
      flatMap((qids: string[]) => {
        let q: string = 'wd:' + qids;
        console.log(qids);
        return this.search(`
           SELECT DISTINCT ?c ?ikey ?cLabel ?cid ?csid WHERE {
           {
               SELECT * WHERE {
                VALUES ?c { ${q} }
                ?c wdt:P31 wd:Q11173 . 
             }} UNION
             {
               SELECT * WHERE {
                ?c wdt:P235 ?ikey . FILTER (STRSTARTS(?ikey, '${query}'))
             }}
             OPTIONAL { ?c wdt:P662 ?cid . }
             OPTIONAL { ?c wdt:P661 ?csid . }
             OPTIONAL { ?c wdt:P235 ?ikey . }
             SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }  
           }
          `);
      }));

  }
}
