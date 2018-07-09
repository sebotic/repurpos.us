import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { SearchResult, Compound } from '../../_models/index';
import { BackendSearchService, SearchResultService, TanimotoScaleService } from '../../_services/index';

import * as _ from 'lodash';


@Component({
  selector: 'app-search-results-table',
  templateUrl: './search-results-table.component.html',
  styleUrls: ['./search-results-table.component.scss']
})
export class SearchResultsTableComponent implements OnInit {
  private paginator: MatPaginator;

  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    // Required for async loading of data, as per https://stackoverflow.com/questions/48943501/angular-mat-table-datasource-paginator-and-datasource-sort-and-datasource-filter
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  results: SearchResult[];

  responseCode: number; // response coming back from the API query
  APIquery: string;
  displayResults: boolean; // if results are being reset, don't show the results
  notMobile: boolean; // media query for if on small screen

  pageIdx: number = 0; // holder for current page in pagination
  pageSize: number = 10; // holder for current page in pagination

  assays: string[];
  max_num_assays: number = 10;
  minColumns: string[] = ['main_label', 'alias', 'id', 'reframeid']; // minimal set of columns to include
  displayedColumns: string[]; // minimal set of columns to include
  dataSource = new MatTableDataSource<Compound>();

  num_aliases: number = 5; // maximum number of aliases to show at one time
  num_similar: number = 2; // maximum number of similar compounds to show at one time

  tanimotoScale: any; // color scale for tanimoto scores
  getFontColor: any; // function to get the font color for a tanimoto score

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Custom sorting algo to make sure the sorting happens as I expect
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'main_label': return item.main_label.toLowerCase();
        // case 'reframeid': return (item.assays + item.reframeid);
        case 'reframeid': return (item.assays + item.reframeid + item.similar_compounds.length);
        case 'assays': return (item.assays + item.reframeid);
        default: return item[property];
      }
    };
  }


  constructor(
    private backendSvc: BackendSearchService,
    private searchResultService: SearchResultService,
    private titleService: Title,
    private tanimotoSvc: TanimotoScaleService
  ) {
    // media query
    if (window.screen.width > 600) {
      this.notMobile = true;
    }

    // make sure search has been executed
    searchResultService.submitAnnounced$.subscribe(
      submitted => {
        this.displayResults = submitted;
      }

    )

    // get search results
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        // reset pagination
        this.pageIdx = 0;
        this.pageSize = 10;

        this.responseCode = result.status;
        this.APIquery = result.url;

        if (result.data) {
          let results = result.data;

          // Calculate the number of assays per hit
          results.forEach((d: any) => {
            d['assays'] = d.assay_types.length;
            d['aliases'] = this.removeDupeAlias(d.aliases);
            d['alias_ct'] = this.num_aliases;
            d['similar_showall'] = false;
          });

          // Sort results by multiple columns
          // this.dataSource.data = results;
          this.dataSource.data = this.sortResults(results);
          // this.resetSort();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // set title of page
          this.titleService.setTitle("search results | reframeDB");
        }


      });

    // get tanimoto color function
    this.tanimotoScale = tanimotoSvc.getScale();
    this.getFontColor = tanimotoSvc.getFontColor();

  }

  resetSort() {
    if (this.sort) {
      if (this.sort.active) this.sort.active = "";
      this.sort.direction = "";
      this.sort.start = "asc";
      this.sort._stateChanges.next();
    }
  }

  ngOnInit() {
    this.dataSource.data = [];
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    //
    // this.dataSource.sort = this.sort;
    // console.log(this.dataSource)
  }

  sortResults(results) {
    // apply the sorting function
    // NOTE: Chrome and Firefox --> different sorting results since Chrome sorts by arbitrary values in ties.
    // Solution: sort by TM score, then ES score (rank from search result)
    // https://medium.com/@fsufitch/is-javascript-array-sort-stable-46b90822543f
    let sorted = _.orderBy(results, [function(o) { return o.tanimoto.toFixed(2); }], ['desc'])
    // let sorted = _.orderBy(results, [function(o) { return o.tanimoto.toFixed(2); }, function(o) { return o.search_result_index; }], ['desc', 'desc'])
    // let sorted = _.orderBy(results, [function(o) { return o.tanimoto.toFixed(2); }, function(o) { return o.main_label.toLowerCase(); }], ['desc', 'asc'])

    // Determine which columns to show in table (e.g. +/- Tanimoto score)
    this.getColumns(sorted);

    return (sorted);
  }


  getColor(assays) {
    let min_alpha = 0.15;

    if (assays.length === 0) {
      return 0;
    }
    return ((assays.length - 1) / (this.max_num_assays - 1)) * (1 - min_alpha) + min_alpha;
  }


  getColumns(df: Compound[]) {
    this.displayedColumns = this.minColumns.slice(0); // create shallow copy
    // if tanimoto exists, add it to the displayed properties.
    if (df.some(el => el['tanimoto'] > 0)) {
      this.displayedColumns.push('tanimoto')
    }


    if (this.notMobile) {
      this.displayedColumns.splice(2, 0, 'struct') // insert structure into the cols
      this.displayedColumns = this.displayedColumns.concat('assays', 'assay_titles');
    } else {
      this.displayedColumns = this.displayedColumns.concat('assays');
    }

  }

  // Alias functions
  removeDupeAlias(arr: string[]) {
    let unique_alias: string[] = [];
    let stripped_alias: string[] = [];

    // function to standardize aliases
    let strip_alias = function(str: string) {
      // regex remove (), -'s, case specificity
      let re = /\((.*)\)/;
      return (str.replace('-', '').replace(re, '').trim().toLowerCase())
    }

    let current_alias: string;
    let current_stripped: string;

    for (let i = 0; i < arr.length; i++) {
      current_alias = arr[i];
      current_stripped = strip_alias(current_alias);

      if (!stripped_alias.includes(current_stripped)) {
        unique_alias.push(current_alias);
        stripped_alias.push(current_stripped);
      }
    }

    return (unique_alias);

  }

  onSortChange(event) {
    this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.dataSource.sort);
    // console.log(this.dataSource.sortData(this.dataSource.data, this.dataSource.sort).map(d=> d.main_label))
  }


  onPageChange(event) {
    this.pageIdx = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  showMore(row_num) {
    let sortedData = this.dataSource.sortData(this.dataSource.data, this.dataSource.sort);
    sortedData[row_num + this.pageIdx * this.pageSize]['alias_ct'] += this.num_aliases;
    this.dataSource.data = sortedData;
    // this.dataSource.data[row_num + this.pageIdx * this.pageSize]['alias_ct'] += this.num_aliases;
  }
}
