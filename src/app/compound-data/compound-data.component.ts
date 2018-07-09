import { Component, OnInit, forwardRef, Inject, Injectable, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Http, Response } from "@angular/http";
import { Location } from '@angular/common';

// import { InteractionTableDataService } from "../interaction-table/interaction-table.component"

// import { gottlieb, gottlieb_pub } from '../../assets/gottlieb_data';
import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { AssayData, GVKData, IntegrityData, InformaData, VendorData, WDQSData, Compound, SearchResult } from '../_models/index';
import { WDQService, BackendSearchService } from '../_services/index';
import { environment } from "../../environments/environment";


@Component({
  outputs: ['cid'],
  selector: 'app-compound-data',
  templateUrl: './compound-data.component.html',
  styleUrls: ['./compound-data.component.scss'],
})
export class CompoundDataComponent implements OnInit {
  qid: string;
  id: string;
  smiles: string;
  reframeID: string;
  // results: Object;
  // data: Object;
  loggedIn: boolean;
  showVendor: boolean = false;
  label: string;
  tableData: Array<Object> = [];
  aliases: Array<string> = [];
  chemVendors: Array<Object> = [];
  table_data: Array<Object> = [];
  prop_name_map: Object = {};
  propsToDisplay: Array<string> = ['P274', 'P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665', 'P233', 'P2017',
    'P234', 'P235', 'P652', 'P595', 'P3636', 'P232', 'P2275', 'P3350', 'P267', 'P2892', 'P3345', 'P486', 'P2115', 'P3780',
    'P3776', 'P3777', 'P3771', 'P129', 'P3489', 'P2868', 'P2175'];

  idPropsToDisplay: Array<string> = ['P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665',
    'P652', 'P595', 'P3636', 'P232', 'P2275', 'P3350', 'P267', 'P2892', 'P3345', 'P486', 'P2115'];

  idData: Array<Object> = [];
  assayData: any = [];
  gvkData: GVKData;
  informaData: InformaData;
  integrityData: IntegrityData;

  // Parameters for similarity results
  num_similar_per_page: number = 3;
  tanimoto: number = 0.85; // threshold for TM score
  similarityResults: Object[];

  showMoreProperties = ['P3489', 'P2868', 'P129', 'P3776', 'P3777', 'P3771'];

  excludeFromTableDisplay: Array<string> = ['P2175'];

  displayShowMorePane: boolean = false;

  vendors: Array<Object> = [
    { 'name': 'GVK Excelra GoStar', 'link': 'https://gostardb.com/gostar/loginEntry.do' },
    { 'name': 'Clarivate Integrity', 'link': 'https://integrity.thomson-pharma.com/integrity/xmlxsl/pk_home.util_home' },
    { 'name': 'Citeline Pharmaprojects', 'link': 'https://pharmaintelligence.informa.com/contact/contact-us' }
  ];

  // propsLabelMap: Object = {
  //   'P274': 'Chemical Formula',
  //   'P231': 'CAS Registry Number',
  //   'P662': 'PubChem CID',
  //   'P661': 'ChemSpider ID',
  //   'P592': 'CHEMBL ID',
  //   'P715': 'DrugBank ID',
  //   'P683': 'ChEBI ID',
  //   'P665': 'KEGG ID',
  //   'P233': 'canonical SMILES',
  //   'P2017': 'isomeric SMILES',
  //   'P234': 'InChI',
  //   'P235': 'InChI Key',
  //   'P652': 'FDA UNII',
  //   'P595': 'Guide to Pharmacology Ligand ID',
  //   'P3636': 'PDB Ligand ID',
  //   'P232': 'EINECS Number',
  //   'P2275': 'WHO International Nonproprietary Name',
  //   'P267': 'ATC code',
  //   'P2892': 'UMLS CUI',
  //   'P3345': 'RxNorm CUI',
  //   'P486': 'MeSH ID',
  //   'P2115': 'NDF-RT ID'
  // };


  constructor(
    @Inject(forwardRef(() => WDQService)) public wd: WDQService,
    private route: ActivatedRoute,
    private router: Router,
    private http: Http,
    private http2: HttpClient,
    // private cidService: CIDService,
    public searchSvc: BackendSearchService,
    public _location: Location
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd)
        this.router.navigated = false;
    })

    this.route.params.subscribe(params => {
      this.qid = params['qid'];
      this.id = params['id'];
      this.buildData();
    });
  }

  ngOnInit() {
    // let query: string = `
    // SELECT ?prop ?propLabel ?furl WHERE {
    //   VALUES ?prop { wd:${this.propsToDisplay.join(' wd:')} }
    //   OPTIONAL {?prop wdt:P1630 ?furl .}

    //   SERVICE wikibase:label {bd:serviceParam wikibase:language "en" . }
    //   }`;

    // this.http2.get<WDQSData>('https://query.wikidata.org/sparql', {
    //   observe: 'response',
    //   headers: new HttpHeaders()
    //     .set('Accept', 'application/json'),
    //   params: new HttpParams()
    //     .set('query', query)
    //     .set('format', 'json')
    // }).subscribe((r) => {
    //   let b = r.body;

    //   for (let i of b.results.bindings) {
    //     let p: string = i['prop']['value'].split('/').pop();

    //     this.prop_name_map[p] = i['propLabel']['value'];
    //   }


    //   if (localStorage.getItem('auth_token')) {
    //     this.loggedIn = true;
    //   } else {
    //     this.loggedIn = false;
    //     this.loggedIn = true; // BUG BUG BUG BUG TODO: revert
    //   }


    //   // Wait for all the data to come back before making the call to get similarity data and append all aliases
    //   Promise.all([this.buildWD(), this.retrieveData()]).then(allData => {
    //     // Run a query to get any compounds that are similar
    //     this.retrieveSimilarData();
    //     // Merge together Wikidata + vendor aliases
    //     this.getAliases();
    //   })
    // });
    this.buildData();
  }

  buildData() {
    let query: string = `
    SELECT ?prop ?propLabel ?furl WHERE {
      VALUES ?prop { wd:${this.propsToDisplay.join(' wd:')} }
      OPTIONAL {?prop wdt:P1630 ?furl .}

      SERVICE wikibase:label {bd:serviceParam wikibase:language "en" . }
      }`;

    this.http2.get<WDQSData>('https://query.wikidata.org/sparql', {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('query', query)
        .set('format', 'json')
    }).subscribe((r) => {
      let b = r.body;

      for (let i of b.results.bindings) {
        let p: string = i['prop']['value'].split('/').pop();

        this.prop_name_map[p] = i['propLabel']['value'];
      }


      if (localStorage.getItem('auth_token')) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
        this.loggedIn = true; // BUG BUG BUG BUG TODO: revert
      }


      // Wait for all the data to come back before making the call to get similarity data and append all aliases
      Promise.all([this.buildWD(), this.retrieveData()]).then(allData => {
        // Run a query to get any compounds that are similar
        this.retrieveSimilarData();
        // Merge together Wikidata + vendor aliases
        this.getAliases();
      })
    });
  }


  // Main function to gather Wikidata data
  buildWD(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      let q: string = `
      SELECT ?compound ?compoundLabel ?prop ?id ?idLabel WHERE {
        VALUES ?compound {wd:${this.qid}}
        VALUES ?prop { wdt:${this.propsToDisplay.join(' wdt:')} skos:altLabel}
        OPTIONAL {?compound ?prop ?id filter (isIRI(?id) || (lang(?id) = "en" || lang(?id) = "")) .}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }`;


      this.http2.get<WDQSData>('https://query.wikidata.org/sparql', {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json'),
        params: new HttpParams()
          .set('query', q)
          .set('format', 'json')
      }).subscribe((r) => {
        let b = r.body;
        let tmp: Object = {};

        for (let i of b.results.bindings) {
          this.label = i['compoundLabel']['value'];

          let p: string = i['prop']['value'].split('/').pop();

          // for some reason, the sparql endpoint returns a result for properties which actually not on that item
          if (!i.hasOwnProperty('id')) {
            continue;
          }

          // separate out aliases
          if (p === 'core#altLabel') {
            this.aliases.push(i['idLabel']['value']);
            continue;
          }

          let qid: string = i['id']['value'];
          let v: string = i['idLabel']['value'];

          if (p.startsWith('P')) {
            if (tmp.hasOwnProperty(p)) {

              tmp[p]['values'].push(v);
              if (qid.startsWith('http://www.wikidata.org/entity/Q')) {
                tmp[p]['qids'].push(qid.split('/').pop());
              }
            }
            else {
              tmp[p] = {
                values: [v],
                qids: [],
                showMore: false,
                pid: ''
              };

              if (qid.startsWith('http://www.wikidata.org/entity/Q')) {
                tmp[p]['qids'].push(qid.split('/').pop());
              }
            }

          }
        }

        for (let y of this.propsToDisplay) {

          if (tmp.hasOwnProperty(y)) {
            let sm: boolean = this.showMoreProperties.includes(y);

            if (this.idPropsToDisplay.includes(y) && !this.excludeFromTableDisplay.includes(y)) {
              this.idData.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'showMore': sm, 'pid': y });
            }
            else if (!this.excludeFromTableDisplay.includes(y)) {
              this.table_data.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'qids': tmp[y]['qids'], 'showMore': sm, 'pid': y });
            }

            // if (y == 'P662') {
            //   this.cidService.announceNewCID(tmp[y]['values'][0].toString());
            // }
          }

        }

        if (!tmp.hasOwnProperty('P2175')) {
          this.retrieveLabels([]);
        }
        else {
          this.retrieveLabels(Array.from(tmp['P2175']['qids']).map((x: string) => x.split('/').pop()));
        }

        // let pubchem_id = this.idData.find((d: any) => d.property === 'PubChem CID');

        // if (pubchem_id) {
        //   this.cid = pubchem_id['values'][0]
        // }

        resolve("Success with WD!");
      });
    })
  }


  // set_cid(): void {
  //   for (let i of [this.gvkData, this.informaData, this.integrityData]) {
  //     if ('PubChem CID' in i && !this.cid) {
  //       this.cid = i['PubChem CID'].substring(3);
  //       this.cidService.announceNewCID(this.cid);
  //
  //       break;
  //     }
  //   }
  // }

  // if no cid exists, try to find one, announce it and trigger rendering of compound
  set_label(label: string): void {
    if (!this.label) {
      this.label = label;
      // console.log('label set', this.label, label);
    }
  }



  // Main function to grab the data from the backend from the vendors and the assay results
  retrieveData(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.http2.get<VendorData>(environment.host_url + '/data', {
        observe: 'response',
        // withCredentials: true,
        headers: new HttpHeaders()
          .set('Accept', 'application/json') // TODO: revert
          .set('Authorization', localStorage.getItem('auth_token')),
        params: new HttpParams()
          .set('qid', this.id)
      }).subscribe((r) => {
        let b = r.body[this.id];
        this.reframeID = b.reframe_id;
        this.gvkData = b.gvk;
        this.informaData = b.informa;
        this.integrityData = b.integrity;
        this.assayData = b.assay;

        // this.set_cid();

        this.chemVendors = this.getChemVendors();
        resolve("Success with vendor data!");
      });
    })
  }

  retrieveSimilarData(): void {
    if (this.table_data.map((d: any) => d.property).indexOf('isomeric SMILES') > -1) {
      this.smiles = this.table_data.find((d: any) => d.property === "isomeric SMILES")['values'][0];
    } else if (this.table_data.map((d: any) => d.property).indexOf('canonical SMILES') > -1) {
      this.smiles = this.table_data.find((d: any) => d.property === "canonical SMILES")['values'][0];
    } else {
      this.smiles = this.informaData['smiles'] || this.integrityData['smiles'] || this.gvkData['smiles'];
    }

    if (this.smiles) {
      this.searchSvc.searchSimilarity(this.smiles, this.tanimoto)
        .subscribe(
          (results: SearchResult) => {
            // console.log(results)

            // filter out the search query (e.g. the compound on the page that launched the search)
            this.similarityResults = results.data.filter((d: any) => d.id !== this.id);

            // remove closely related aliases / synonyms
            this.similarityResults.forEach((d: any) => {
              d['aliases'] = this.removeDupeAlias(d.aliases);
            });

          },
          (err: any) => {
            console.log(err)
          }
        );
    }
  }

  getAliases() {
    // extract aliases an make sure label is set
    let alias_arr: string[] = this.aliases;

    if (Object.keys(this.gvkData).length > 0) {
      for (let name of this.gvkData['drug_name']) {
        this.set_label(name);
        alias_arr.push(name);
      }

      for (let name of this.gvkData['synonyms']) {
        alias_arr.push(name);
      }
    }

    if (Object.keys(this.integrityData).length > 0) {
      for (let name of this.integrityData['drug_name']) {
        this.set_label(name);
        alias_arr.push(name);
      }
    }

    if (Object.keys(this.informaData).length > 0) {
      for (let name of this.informaData['drug_name']) {
        this.set_label(name);
        alias_arr.push(name);
      }
    }

    // de-duplicate
    let alias_set = new Set(alias_arr);

    this.aliases = Array.from(alias_set);

    // Sort aliases by name (case-insensitive)
    this.aliases = this.aliases.sort(function(a: string, b: string) {
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else {
        return -1;
      };
    })
  }

  // Alias function to do a hard scrub on closely related aliases, for the similar compounds
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

    return (unique_alias.sort((a: string, b: string) => a.toLowerCase() > b.toLowerCase() ? 1 : -1));

  }

  getChemVendors(): Array<Object> {
    let uniqueVendors = [];

    this.assayData.forEach(function(d: any) {
      let sel_vendor = uniqueVendors.find(x => x.chem_vendor === d.chem_vendor);

      if (sel_vendor == null) {
        uniqueVendors.push({
          'chem_vendor': d.chem_vendor,
          'chem_vendor_id': d.chem_vendor_id
        })
      } else {
        if (sel_vendor['chem_vendor_id'] !== d.chem_vendor_id) {
          uniqueVendors.push({
            'chem_vendor': d.chem_vendor,
            'chem_vendor_id': d.chem_vendor_id
          })
        }
      }
    })

    return (uniqueVendors);
  }


  showMore(clickEvent, qid: string): void {
    let elementID: string = clickEvent.srcElement.id;

    this.displayShowMorePane = !this.displayShowMorePane;
  }


  retrieveLabels(disease_qids: Array<string>): void {
    let tmp_str: string = disease_qids.join(' wd:');
    let query: string = `
    https://query.wikidata.org/sparql?query=SELECT ?qid ?qidLabel WHERE {
    	VALUES ?qid {wd:${tmp_str}}
    	SERVICE wikibase:label { bd:serviceParam wikibase:language "en" .}
    }&format=json
    `;
    // console.log(query);
    this.http.request(query)
      .subscribe((res: Response) => {
        let tt = res.json();
        // console.log(tt);

        if (disease_qids.length !== 0) {

          for (let x of tt['results']['bindings']) {
            this.tableData.push({
              'compound_name': this.label,
              'compound_qid': this.qid,
              'disease_name': x['qidLabel']['value'],
              'disease_qid': x['qid']['value'],
              'reference': 'FDA',
              'reference_qid': ''
            })
          }
        }
      });
  }

}
