import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from "@angular/router";

import { SearchResult } from '../../_models/index';
import { SearchResultService } from '../../_services/index';
import { TanimotoScaleService } from '../../_services/index';
// import * as Chroma from 'chroma-js';

export interface Compound {

  id: string;
  main_label: string;
  assay_types: string[];
  tanimoto_score?: number;
  reframeid?: string;
  qid?: string;
  // qid: string;
  // ikey: string;
  // name: string;
  // chemspider: string;
  // pubchem: string;
}

@Component({
  selector: 'app-search-results-table',
  templateUrl: './search-results-table.component.html',
  styleUrls: ['./search-results-table.component.css']
})
export class SearchResultsTableComponent implements OnInit {
  @Input() result; //that is currently redundant, but could replace the entire search result service Observable

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  sdata: SearchResult;

  assays: string[];
  max_num_assays: number = 16;
  displayedColumns = ['name', 'id', 'reframe']; // minimal set of columns to include
  dataSource = new MatTableDataSource<Compound>();

  testData: Compound[] = [
    {
      'id': 'Q7842225',
      'qid': 'Q7842225',
      'reframeid': 'RFM-011-161-5',
      'main_label': 'trimetrexate',
      'tanimoto_score': 0.97,
      'assay_types': ['HEK293T 72-h cytotoxicity assay', 'HepG2 72-h cytotoxicity assay', 'HEK293T Cytotoxicity 72H Assay']
    },

    {
      'id': 'Q27088554',
      'qid': 'Q27088554',
      'reframeid': 'RFM-011-161-5',
      'main_label': 'rilapladib',
      'tanimoto_score': 0.44,
      'assay_types': [
        'Crypto-C. parvum HCI proliferation assay - Sterling Lab',
        'Crypto-C. parvum HCI proliferation assay - Bunch Grass Farm',
        'Crypto-HCT-8 Host Cells - Sterling Lab C. parvum',
        'Crypto-HCT-8 Host Cells - Bunch Grass Farm C. parvum',
        'HEK293T 72-h cytotoxicity assay',
        'HEK293T Cytotoxicity 72H Assay']
    },
    {
      'id': 'Q177094',
      'qid': 'Q177094',
      'main_label': 'imatinib',
      'tanimoto_score': 0.24,
      'assay_types': []
    }
  ]

    tanimotoScale: any; // color scale for tanimoto scores
    getFontColor: any; // function to get the font color for a tanimoto score


  constructor(
    private searchResultService: SearchResultService,
    private el: ElementRef,
    private router: Router,
    private tanimotoSvc: TanimotoScaleService
  ) {
    // get search results
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        this.sdata = result;
        console.log(this.sdata.data);
        // this.dataSource.data = this.prepareViewData(this.sdata.data);
        let results = this.sdata.data['body']['results'];
        this.dataSource.data = this.sortResults(results);
        console.log('this.dataSource.data')
        console.log(this.dataSource.data)
        this.getColumns();

      });

      // get tanimoto color function
      this.tanimotoScale = tanimotoSvc.getScale();
      this.getFontColor = tanimotoSvc.getFontColor();
  }

  ngOnInit() {
    // this.getColumns();
    // this.dataSource.sort = this.sort;
    // console.log(this.dataSource.data)
    // in conjunction with the result input, this would work as a data provider for the table at component initialization
    // this.dataSource.data = this.prepareViewData(this.result.data);
  }

  rowClicked(event, qid, id) {
    this.router.navigate([`compound_data/${id.split('/').pop()}`,  {qid: qid.split('/').pop()}]);
  }


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource)

    this.dataSource.sort = this.sort;
    console.log(this.dataSource)
  }

  sortResults(results) {
    // sequential sorting function
    console.log('results')
    console.log(results)

    let sort_func = function (a,b) {
      // sort first by tanimoto score, descending
      if(a.tanimoto.toFixed(2) !== b.tanimoto.toFixed(2)) return b.tanimoto - a.tanimoto;
      // sort next by # assay hits, descending
      if(a.assay_types.length !== b.assay_types.length) return b.assay_types.length - a.assay_types.length;

      // then by in screening library:
      let a_rfm = a.reframeid !== ""; // true if compound exists
      let b_rfm = b.reframeid !== "";
      if(a_rfm !== b_rfm) return a_rfm < b_rfm;

      // last resort: alpha sort by name, ascending
      return(a.main_label.toLowerCase() > b.main_label.toLowerCase());
    }
    // sort first by
    let sorted = results.sort(sort_func);
    console.log('sorted')
    console.log(results.sort(sort_func))
    return(sorted);
  }

  getColor(assays) {
    let min_alpha = 0.25;

    if(assays.length === 0) {
      return 0;
    }
    return (assays.length / this.max_num_assays) * (1 - min_alpha) + min_alpha;
  }


  getColumns() {
    // pull out the variable names for each result, collapse to a list, and remove dupes
    let get_unique_values = function(arr: Array<any>, var_name: string): Array<any> {
      let values = arr.map(d => d[var_name]);
      // console.
      let unique_vals = new Set(values.reduce((acc, val) => acc.concat(val), []));

      return (Array.from(unique_vals.values()))
    };

    // if tanimoto exists, add it to the displayed properties.
    let tm_scores = get_unique_values(this.dataSource.data, 'tanimoto');
    if (tm_scores.some(el => el > 0)) {
      this.displayedColumns.push('tanimoto')
    }

    // append assay name
    this.assays = get_unique_values(this.dataSource.data, 'assay_types').sort();
    this.displayedColumns = this.displayedColumns.concat('assays', 'assay_titles');
  }


  // prepareViewData(raw_json: Object): any {
  //   let compounds: Array<Compound> = [];
  //
  //   if (raw_json) {
  //     for (let x of raw_json['results']['bindings']) {
  //       // console.log(x);
  //
  //       compounds.push({
  //         // 'qid': x['c']['value'],
  //         // 'ikey': x['ikey']['value'],
  //         // 'name': x['cLabel']['value'],
  //         // 'chemspider': x['csid'] ? x['csid']['value'] : " ",
  //         // 'pubchem': x['cid'] ? x['cid']['value'] : " ",
  //       });
  //     }
  //   }
  //   return compounds;
  // }
}
