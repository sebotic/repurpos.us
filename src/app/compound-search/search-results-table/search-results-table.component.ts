import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from "@angular/router";

import { SearchResult } from '../../_models/index';
import { SearchResultService } from '../../_services/index';
import { TanimotoScaleService } from '../../_services/index';
// import * as Chroma from 'chroma-js';

export interface Compound {

  id: string;
  test: string;
  main_label: string;
  assay_types: string[];
  alias: string[];
  assays: number;
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

  notMobile: boolean; // media query for if on small screen

  assays: string[];
  max_num_assays: number = 10;
  displayedColumns = ['main_label', 'alias', 'id', 'reframeid']; // minimal set of columns to include
  dataSource = new MatTableDataSource<Compound>();

  num_aliases: number = 5; // maximum number of aliases to show at one time
  // num_aliases: number = this.max_aliases;
  // //
  // testSynonyms: string[] = ["4-(Acetylamino)phenol", "4-Hydroxyacetanilide", "4-Hydroxyanilid kyseliny octove", "A-Per", "A.F. Anacin", "Abenol", "Abensanil", "Abrol", "Abrolet", "Acamol", "Accu-Tap", "Acenol", "Acephen", "Acertol", "Aceta Elixir", "Aceta Tablets", "Acetagesic", "Acetalgin", "Acetaminofen", "ACETAMINOPHEN", "acetaminophen, Flashtab", "acetaminophen, Kowa", "Acetamol", "Actamin", "Actamin Extra", "Actamin Super", "Actifed Plus", "Actimol Chewable Tablets", "Actimol Children'S Suspension", "Actimol Infants' Suspension", "Actimol Junior Strength Caplets", "Actron", "AF ANACIN", "Afebrin", "Afebryl", "Aferadol", "Algesidal", "Algotropyl", "Allay", "Alpiny", "Alpinyl", "Alvedon", "Aminofen", "Aminofen Max", "Anacin-3", "Anacin-3 Extra Strength", "Anadin dla dzieci", "Anaflon", "Analter", "Anapap", "Andox", "Anelix", "Anexsia", "Anexsia 10/660", "Anexsia 5/325", "Anexsia 7.5/325", "Anexsia 7.5/650", "Anhiba", "Anoquan", "Anti-Algos", "Antidol", "Apacet", "Apacet Capsules", "Apacet Elixir", "Apacet Extra Strength Tablets", "Apacet Regular Strength Tablets", "Apadon", "Apamid", "Apamide", "APAP", "Apitrelal", "Apo-Acetaminophen", "Arfen", "Asetam", "Asomal", "Aspac", "Aspirin Free Anacin Maximum Strength Caplets", "Aspirin Free Anacin Maximum Strength Gel Caplets", "Aspirin-Free Anacin", "Aspirin-Free Excedrin Caplets", "Asplin", "Atasol Caplets", "Atasol Drops", "Atasol Oral Solution", "Atasol Tablets", "Atralidon", "Babikan", "Bacetamol", "Bancap", "Bancap Hc", "Banesin", "Bayer Select Allergy-Sinus", "Bayer Select Head Cold", "Bayer Select Headache Pain", "Bayer Select Maximum Strength Headache Pain Relief Formula", "Bayer Select Sinus Pain Relief", "Ben-u-ron", "Benmyo", "Bickie-mol", "Biocetamol","Bucet", "Butapap", "Cadafen", "Calapol", "Calmanticold", "Calpol", "Capital with Codeine", "Captin", "Causalon", "Cefalex", "Children'S Acetaminophen Elixir Drops", "Children'S Tylenol Chewable", "Claradol Codeine", "Clixodyne", "Co-Gesic", "Codabrol", "Codalgin", "Codapane", "Codicet", "Codisal", "Codisal Forte", "Codoliprane", "Codral Pain Relief", "Cofamol", "Conacetol", "Contra-Schmerz P", "Coricidin", "Coricidin D", "Coricidin Sinus", "Cosutone", "Croix Blanche", "Cuponol", "Curadon", "Custodial", "Dapa X-S", "Darocet", "Darvocet", "Darvocet-N 50", "Datril", "Datril Extra-Strength", "Daygrip", "Demilets", "Democyl", "Demogripal", "Desfebre", "Dhamol", "Dhc Plus", "Dial-a-gesic", "Dial-alpha-gesic", "Dimindol", "Dirox", "Disprol", "Dol-Stop", "Dolcor", "Dolefin", "Dolegrippin", "Dolene Ap-65", "Dolgesic", "Doliprane", "Dolko", "Dolofugin", "Doloreduct", "Dolorfug", "Dolorol Forte", "Dolorstop", "Dolotec", "Dolprone", "Dresan", "Dristancito", "Duracetamol", "Duradyne Dhc", "Durapan", "Dymadon", "Dymadon Co", "Dymadon Forte", "Ecosetol", "Elixodyne", "Empracet", "Endecon", "Enelfa", "Eneril", "Esgic", "Esgic-Plus", "Eu-Med", "Excedrin", "Excedrin Caplets", "Excedrin Extra Strength Caplets", "Excipain", "Exdol", "Exdol Strong", "Farmadol", "Febranine", "Febrectal", "Febrectol", "Febricet", "Febridol", "Febrilix", "Febrin", "Febrinol", "Febro-Gesic"]

  testSynonyms: string[] = ["apitolisib", "Apitolisib", "apitolisib (capsule)", "apitolisib (tablet)", "GDC-0980", "GDC-0980", "GDC-0980 (capsule)", "GDC-0980 (tablet)", "GDC0980", "GDC0980", "GDC0980 (capsule)", "GDC0980 (tablet)", "RG-7422", "RG-7422", "RG-7422 (capsule)", "RG-7422 (tablet)", "RG7422", "RG7422", "RG7422 (capsule)", "RG7422 (tablet)"];

  // testData: Compound[] = [
  //   {
  //     'id': 'Q7842225',
  //     'qid': 'Q7842225',
  //     'reframeid': 'RFM-011-161-5',
  //     'main_label': 'trimetrexate',
  //     'tanimoto_score': 0.97,
  //     'assay_types': ['HEK293T 72-h cytotoxicity assay', 'HepG2 72-h cytotoxicity assay', 'HEK293T Cytotoxicity 72H Assay']
  //   },
  //
  //   {
  //     'id': 'Q27088554',
  //     'qid': 'Q27088554',
  //     'reframeid': 'RFM-011-161-5',
  //     'main_label': 'rilapladib',
  //     'tanimoto_score': 0.44,
  //     'assay_types': [
  //       'Crypto-C. parvum HCI proliferation assay - Sterling Lab',
  //       'Crypto-C. parvum HCI proliferation assay - Bunch Grass Farm',
  //       'Crypto-HCT-8 Host Cells - Sterling Lab C. parvum',
  //       'Crypto-HCT-8 Host Cells - Bunch Grass Farm C. parvum',
  //       'HEK293T 72-h cytotoxicity assay',
  //       'HEK293T Cytotoxicity 72H Assay']
  //   },
  //   {
  //     'id': 'Q177094',
  //     'qid': 'Q177094',
  //     'main_label': 'imatinib',
  //     'tanimoto_score': 0.24,
  //     'assay_types': []
  //   }
  // ]

  tanimotoScale: any; // color scale for tanimoto scores
  getFontColor: any; // function to get the font color for a tanimoto score


  constructor(
    private searchResultService: SearchResultService,
    private el: ElementRef,
    private router: Router,
    private tanimotoSvc: TanimotoScaleService
  ) {
    // media query
    if (window.screen.width > 600) {
      this.notMobile = true;
    }

    // get search results
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        this.sdata = result;
        // console.log(this.sdata.data);
        // this.dataSource.data = this.prepareViewData(this.sdata.data);
        let results = this.sdata.data['body']['results'];

        // Calculate the number of assays per hit
        results.forEach((d: any) => {
          d['assays'] = d.assay_types.length;
          //TODO: replace with the correct variable name
          // d['aliases'] = this.removeDupeAlias(this.testSynonyms);
          d['aliases'] = this.removeDupeAlias(d.assay_types);
          d['alias_ct'] = this.num_aliases;
        });

        // Sort results by multiple columns
        this.dataSource.data = this.sortResults(results);

        // Determine which columns to show in table (e.g. +/- Tanimoto score)
        this.getColumns();
        // console.log(results)

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
    this.router.navigate([`compound_data/${id.split('/').pop()}`, { qid: qid.split('/').pop() }]);
  }


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
  }

  sortResults(results) {
    // sequential sorting function
    let sort_func = function(a, b) {
      // sort first by tanimoto score, descending
      if (a.tanimoto.toFixed(2) !== b.tanimoto.toFixed(2)) return b.tanimoto - a.tanimoto;
      // sort next by # assay hits, descending
      if (a.assay_types.length !== b.assay_types.length) return b.assay_types.length - a.assay_types.length;

      // then by if in screening library:
      let a_rfm = a.reframeid !== ""; // true if compound exists
      let b_rfm = b.reframeid !== "";
      if (a_rfm !== b_rfm) return a_rfm < b_rfm;

      // last resort: alpha sort by name, ascending
      return (a.main_label.toLowerCase() > b.main_label.toLowerCase() ? 1 : -1);
    }
    // apply the sorting function
    let sorted = results.sort(sort_func);
    return (sorted);
  }

  getColor(assays) {
    let min_alpha = 0.15;

    if (assays.length === 0) {
      return 0;
    }
    return ((assays.length - 1) / (this.max_num_assays - 1)) * (1 - min_alpha) + min_alpha;
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

    if (this.notMobile) {
      this.displayedColumns = this.displayedColumns.concat('assays', 'assay_titles');
    } else {
      this.displayedColumns = this.displayedColumns.concat('assays');
    }

  }

  // Alias functions
  removeDupeAlias(arr: string[]) {
    let unique_alias: string[] = [];
    let stripped_alias: string[] = []; // function to standardize aliases

    let strip_alias = function(str: string) {
      // regex remove ()
      let re = /\((.*)\)/;
      return (str.replace(re, '').replace('-', '').trim().toLowerCase())
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

    return(unique_alias);

    // this.num_aliases = new Array(this.testSynonyms.length).fill(this.max_aliases);

  }

  showMore(row_num) {
    this.dataSource.data[row_num]['alias_ct'] += this.num_aliases;
    // += this.num_aliases;
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
