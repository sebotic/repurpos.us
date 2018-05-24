import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from "@angular/router";

import { SearchResult } from '../../_models/index';
import { SearchResultService } from '../../_services/index';

import * as Chroma from 'chroma-js';

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


  assays: string[] = ['HEK293T 72-h cytotoxicity assay',
    'HepG2 72-h cytotoxicity assay',
    'HEK293T Cytotoxicity 72H Assay',
    'Crypto-C. parvum HCI proliferation assay - Sterling Lab',
    'Crypto-C. parvum HCI proliferation assay - Bunch Grass Farm',
    'Crypto-HCT-8 Host Cells - Sterling Lab C. parvum',
    'Crypto-HCT-8 Host Cells - Bunch Grass Farm C. parvum'];
  displayedColumns = ['name', 'id', 'qid', 'tanimoto', 'reframe'].concat(this.assays);
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

  tanimotoScale = Chroma.scale(['#ffffff', '#ffb6b0', '#f36664', '#c3152e']).mode('lab');


  constructor(
    private searchResultService: SearchResultService,
    private el: ElementRef,
    private router: Router,
  ) {
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        // this.sdata = result;
        // this.dataSource.data = this.prepareViewData(this.sdata.data);
        this.dataSource.data = this.testData;
      });
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    // in conjunction with the result input, this would work as a data provider for th table at component initialization
    // this.dataSource.data = this.prepareViewData(this.result.data);
  }

  rowClicked(event, qid) {
    this.router.navigate([`compound_data/${qid.split('/').pop()}`]);
  }


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }

  getFontColor(background_color: any) {
    if (Chroma.contrast(background_color, '#212529') > 4.5) {
      return '#212529';
    }

    return '#ffffff';
  }

  // TODO:
  // sort by TM Score
  // pull out the Assays
  // update displayed columns
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
