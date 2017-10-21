import {Component, ElementRef, EventEmitter, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SearchResult, SearchResultService, WDQService} from "../compound-search.component";
import {Router} from "@angular/router";
import { DataTableResource } from '../../table/index';


@Component({
  styleUrls: ['./search-result-table.component.css'],
  selector: 'app-search-result-table',
  templateUrl: './search-result-table.component.html',
})
export class SearchResultTableComponent implements OnInit {
  sdata: any;
  tmp: any;

  itemResource;
  items = [];
  itemCount = 0;

  obs: Observable<SearchResult>;
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
  r: SearchResult[];

  constructor(private searchResultService: SearchResultService,
              public wd: WDQService,
              private el: ElementRef,
              private router: Router,

  ) {
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        this.sdata = result;
      });
    console.log(this.sdata);

    this.obs  = Observable.fromEvent(this.el.nativeElement, 'click');
  }

  reloadItems(params) {
    this.itemResource.query(params).then(items => this.items = items);
  }

  rowClick(rowEvent) {
    // console.log(rowEvent);
    console.log('Clicked: ' + rowEvent.row.item.name);
    this.tmp = rowEvent.row.item.name;

    let qid: string = rowEvent.row.item.wd_id.split('/').pop();

    this.obs.map(() => this.wd.search(
      `SELECT ?disease ?diseaseLabel WHERE {
          wd:${qid} wdt:P2175 ?disease .
            SERVICE wikibase:label {bd:serviceParam wikibase:language "en" .}
        }`
    ))
      .switch()
      // act on the return of the search
      .subscribe(
        (results: SearchResult[]) => { // on sucesss
          this.r = results;
        },
        (err: any) => { // on error
          console.log(err);
          // this.loading.next(false);
        },
        () => { // on completion
          // this.loading.next(false);
        }
      );
  }

  rowDoubleClick(rowEvent) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
    let qid: string = rowEvent.row.item.wd_id.split('/').pop();
    console.log(qid);
    // this.compoundDataService.announceNewCompoundData(qid);

    this.router.navigate([`compound_data/${qid}`]);

  }

  rowTooltip(item) { return item.jobTitle; }

  ngOnInit(): void {

    if(this.sdata) {
      // console.log(this.sdata);

      this.itemResource = new DataTableResource(this.prepareViewData(this.sdata.data));
      this.itemResource.count().then(count => this.itemCount = count);
    }
  }

  prepareViewData(raw_json: Object): any {
    let compounds: Array<Object> = [];

    if (raw_json) {
      for (let x of raw_json['results']['bindings']) {
        // console.log(x);

        compounds.push({
          'wd_id': x['c']['value'],
          'InChI Key': x['ikey']['value'],
          'name': x['cLabel']['value'],
          'chemspider': x['csid'] ? x['csid']['value'] : " ",
          'pubchem': x['cid'] ? x['cid']['value'] : " ",
        });
      }
    }
    return compounds;
  }
}

