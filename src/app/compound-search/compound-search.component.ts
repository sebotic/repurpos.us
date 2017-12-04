import {
  Component,
  Injectable,
  OnInit,
  ElementRef,
  EventEmitter,
} from '@angular/core';

import {Observable} from 'rxjs/Rx';
import { Subject }    from 'rxjs/Subject';
import {flatMap, map} from 'rxjs/operators';

// import {$} from "protractor";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class SearchResultService {
  // Observable string sources
  private newSearchResultSource = new Subject<SearchResult>();

  // Observable string streams
  newSearchResult$ = this.newSearchResultSource.asObservable();

  // Service message commands
  announceNewSearchResult(result: SearchResult) {
    this.newSearchResultSource.next(result);
    // console.log(result);
  }
}


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


@Component({
  outputs: ['loading', 'results'],
  selector: 'search-box',
  template: `
    <input type="text" class="form-control" placeholder="Search: <Enter Drug Name or InChI key>" autofocus>
  `
})
export class SearchBox implements OnInit {
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  constructor(public wd: WDQService,
              private el: ElementRef) {
  }

  ngOnInit(): void {
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value.toUpperCase()) // extract the value of the input
      .filter((text: string) => text.length > 2) // filter out if shorter than 2 chars
      .debounceTime(500)                         // only once every 500ms
      .do(() => this.loading.next(true))         // enable loading
      .map((query: string) => this.wd.searchFullText(query ,``))
      .switch()
      // act on the return of the search
      .subscribe(
        (results: SearchResult[]) => { // on sucesss
          this.loading.next(false);
          this.results.next(results);
        },
        (err: any) => { // on error
          console.log(err);
          this.loading.next(false);
        },
        () => { // on completion
          this.loading.next(false);
        }
      );

  }
}

@Component({
  inputs: ['result'],
  outputs: ['sdata'],
  selector: 'search-result',
  template: `<app-search-results-table [result]="result"></app-search-results-table>`,
})
export class SearchResultComponent implements OnInit{
  result: SearchResult;

  constructor(public searchResultService: SearchResultService) {

  }

  announce() {
    this.searchResultService.announceNewSearchResult(this.result);
    console.log(this.result)
  }

  ngOnInit(){
    this.announce();
  }
}

@Component({
  selector: 'app-compound-search',
  templateUrl: './compound-search.component.html',
})
export class CompoundSearchComponent {
  results: SearchResult[];
  loadingGif: string = '../../assets/Loading_icon.gif';

  updateResults(results: SearchResult[]): void {
    this.results = results;
  }
}




