import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SearchResult, SearchResultService} from "../compound-search.component";
import {Router} from "@angular/router";

export interface Compound {
  qid: string;
  ikey: string;
  name: string;
  chemspider: string;
  pubchem: string;
}

@Component({
  selector: 'app-search-results-table',
  templateUrl: './search-results-table.component.html',
  styleUrls: ['./search-results-table.component.css']
})
export class SearchResultsTableComponent implements OnInit {
  @Input() result; //that is currently redundant, but could replace the entire search result service Observable

  @ViewChild(MatPaginator) paginator: MatPaginator;
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  sdata: SearchResult;

  displayedColumns = ['name', 'ikey', 'pubchem', 'chemspider', 'qid'];
  dataSource = new MatTableDataSource<Compound>();

  constructor(
    private searchResultService: SearchResultService,
    private el: ElementRef,
    private router: Router,
    ) {
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        this.sdata = result;
        this.dataSource.data = this.prepareViewData(this.sdata.data);
      });
  }

  ngOnInit() {
    // in conjunction with the result input, this would work as a data provider for th table at component initialization
    // this.dataSource.data = this.prepareViewData(this.result.data);
  }

  rowClicked(event, qid){
    this.router.navigate([`compound_data/${qid.split('/').pop()}`]);
  }


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  prepareViewData(raw_json: Object): any {
    let compounds: Array<Compound> = [];

    if (raw_json) {
      for (let x of raw_json['results']['bindings']) {
        // console.log(x);

        compounds.push({
          'qid': x['c']['value'],
          'ikey': x['ikey']['value'],
          'name': x['cLabel']['value'],
          'chemspider': x['csid'] ? x['csid']['value'] : " ",
          'pubchem': x['cid'] ? x['cid']['value'] : " ",
        });
      }
    }
    return compounds;
  }
}
