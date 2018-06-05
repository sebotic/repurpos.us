import { Component, OnInit, forwardRef, Inject, Injectable, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Response } from "@angular/http";
import { Location } from '@angular/common';

// import { InteractionTableDataService } from "../interaction-table/interaction-table.component"

// import { gottlieb, gottlieb_pub } from '../../assets/gottlieb_data';
import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { AssayData, GVKData, IntegrityData, InformaData, VendorData, WDQSData, SimilarityData } from '../_models/index';
import { CIDService, WDQService } from '../_services/index';
import { environment } from "../../environments/environment";


@Component({
  outputs: ['cid'],
  selector: 'app-compound-data',
  templateUrl: './compound-data.component.html',
  styleUrls: ['./compound-data.component.css'],
})
export class CompoundDataComponent implements OnInit {
  qid: string;
  id: string;
  reframeID: string;
  results: Object;
  data: Object;
  loggedIn: boolean;
  showVendor: boolean = false;
  label: string;
  tableData: Array<Object> = [];
  aliases: Array<string> = [];
  chemVendors: Array<Object> = [];
  // concat_aliases: string = '';
  // concat_aliases: Set<string>;
  // vendor_aliases: Array<string> = [];
  table_data: Array<Object> = [];
  // graphData;
  prop_name_map: Object = {};
  propsToDisplay: Array<string> = ['P274', 'P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665', 'P233', 'P2017',
    'P234', 'P235', 'P652', 'P595', 'P3636', 'P232', 'P2275', 'P3350', 'P267', 'P2892', 'P3345', 'P486', 'P2115', 'P3780',
    'P3776', 'P3777', 'P3771', 'P129', 'P3489', 'P2868', 'P2175'];

  idPropsToDisplay: Array<string> = ['P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665',
    'P652', 'P595', 'P3636', 'P232', 'P2275', 'P3350', 'P267', 'P2892', 'P3345', 'P486', 'P2115'];

  idData: Array<Object> = [];
  assayData: any = [];
  gvkData: Object = [];
  informaData: Object = [];
  integrityData: Object = [];

  num_similar_per_page: number = 4;
  // TODO: replace (temporary, for testing purposes)
  similarityResults: Array<SimilarityData> = [
    { name: 'compound1', match_type: 'tanimoto', url: 'Q27286421', tanimoto: 0.77, pubchem_id: 'CID1691', properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: false }, { name: 'assay hits', value: true }, { name: 'Wikidata ', value: false }, { name: 'GVK', value: false }, { name: 'Integrity', value: true }, { name: 'Citeline', value: true }] },
    { name: 'compound2', match_type: 'stereo-free', url: 'Q272864212', tanimoto: 0.22, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound3', match_type: 'stereo-free', url: 'Q272864213', tanimoto: 0.42, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound4', match_type: 'stereo-free', url: 'Q272864214', tanimoto: 0.62, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound5', match_type: 'stereo-free', url: 'Q272864215', tanimoto: 0.87, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound6', match_type: 'stereo-free', url: 'Q272864216', tanimoto: 0.83, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound7', match_type: 'stereo-free', url: 'Q272864217', tanimoto: 0.52, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound8', match_type: 'stereo-free', url: 'Q272864218', tanimoto: 0.72, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound9', match_type: 'stereo-free', url: 'Q272864218', tanimoto: 0.36, properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: false }, { name: 'Wikidata', value: true }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] },
    { name: 'compound10', match_type: 'tanimoto', url: 'Q2728642110', tanimoto: 0.95, pubchem_id: 'CID3401', properties: [{ name: 'screening collection', tooltip: "physical compound available in screening collection", value: true }, { name: 'assay hits', value: true }, { name: 'Wikidata', value: false }, { name: 'GVK', value: true }, { name: 'Integrity', value: false }, { name: 'Citeline', value: false }] }
  ];

  showMoreProperties = ['P3489', 'P2868', 'P129', 'P3776', 'P3777', 'P3771'];

  excludeFromTableDisplay: Array<string> = ['P2175'];

  displayShowMorePane: boolean = false;
  testJson;

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

  cid: string;

  constructor(
    @Inject(forwardRef(() => WDQService)) public wd: WDQService,
    private route: ActivatedRoute,
    private http: Http,
    private http2: HttpClient,
    // private interactionTableDataService: InteractionTableDataService,
    private cidService: CIDService,
    private _location: Location
  ) {
    route.params.subscribe(params => {
      this.qid = params['qid'];
      this.id = params['id'];
      console.log('the params:', params)
    });
  }

  ngOnInit() {
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
        // console.log(i);
        let p: string = i['prop']['value'].split('/').pop();

        this.prop_name_map[p] = i['propLabel']['value'];
      }


      if (localStorage.getItem('auth_token')) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
        this.loggedIn = true; // TODO: revert
      }

      if (this.qid) {
        this.buildData();
      }
      // this.retrieveAssayData();
      // this.retrieveGVKData();
      this.retrieveData();

      // this.testStream();

      // console.log(JSON.stringify(b));
      // Sort the related data
      // this.similarityData = this.similarityData.sort((a:any, b: any) => b.tanimoto - a.tanimoto)

    });

    // this.wd.search(`
    //   SELECT DISTINCT ?prop ?pLabel WHERE {
    //     ?p wikibase:directClaim ?prop .
    //     SERVICE wikibase:label {bd:serviceParam wikibase:language "en" . }
    //   }
    // `).subscribe(
    //   (results: SearchResult[]) => {
    //     let dt = results.pop().data;
    //     for (let x of dt['results']['bindings']) {
    //       let p: string = x['prop']['value'].split('/').pop();
    //
    //       this.prop_name_map[p] = x['pLabel']['value'];
    //     }
    //
    //     this.buildData();
    //
    //   },
    //   (err: any) => {
    //     console.log(err);
    //
    //   },
    //   () => {
    //
    //   }
    // );
  }

  backClick() {
    this._location.back();
  }

  buildData(): void {
    let q: string = `
      SELECT ?compound ?compoundLabel ?prop ?id ?idLabel WHERE {
        VALUES ?compound {wd:${this.qid}}
        VALUES ?prop { wdt:${this.propsToDisplay.join(' wdt:')} skos:altLabel}
        OPTIONAL {?compound ?prop ?id filter (isIRI(?id) || (lang(?id) = "en" || lang(?id) = "")) .}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }`;

    // console.log(q);

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
      // console.log(b);

      for (let i of b.results.bindings) {
        this.label = i['compoundLabel']['value'];

        // console.log(i);
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
        // if (v.startsWith('http://www.wikidata.org/entity/Q') && i['id']['type'] === 'uri') {
        //   // deal with the fact that a value is another Wikidata item and set the label string instead of the IRI
        //   v = i['idLabel']['value'];
        // }


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
      // console.log(tmp);

      for (let y of this.propsToDisplay) {

        if (tmp.hasOwnProperty(y)) {
          // console.log(y);
          // let value = Array.from(tmp[y]).length > 1 ? Array.from(tmp[y]).join(', ') : Array.from(tmp[y]);
          let sm: boolean = this.showMoreProperties.includes(y);

          if (this.idPropsToDisplay.includes(y) && !this.excludeFromTableDisplay.includes(y)) {
            this.idData.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'showMore': sm, 'pid': y });
          }
          else if (!this.excludeFromTableDisplay.includes(y)) {
            this.table_data.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'qids': tmp[y]['qids'], 'showMore': sm, 'pid': y });
          }

          if (y == 'P662') {
            this.cidService.announceNewCID(tmp[y]['values'][0].toString());
          }
        }

      }

      if (!tmp.hasOwnProperty('P2175')) {
        this.retrieveLabels([]);
      }
      else {
        this.retrieveLabels(Array.from(tmp['P2175']['qids']).map((x: string) => x.split('/').pop()));
      }
      // Concatenate aliases so they can be rendered as one block
      // this.concat_aliases = this.aliases.join(', ');

      // Sort aliases by name (case-insensitive)
      this.aliases = this.aliases.sort(function(a: string, b: string) {
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        } else {
          return -1;
        };
      })



      // console.log(JSON.stringify(b));

    });


    // let query: string = `https://query.wikidata.org/sparql?query=describe <http://www.wikidata.org/entity/${this.qid}>&format=json`;
    //
    // this.http.request(query)
    //   .subscribe((res: Response) => {
    //     this.data = res.json();
    //     let tmp: Object = {};
    //
    //     for (let x of this.data['results']['bindings']) {
    //       if (x['predicate']['value'] === 'http://www.w3.org/2000/01/rdf-schema#label' &&
    //         x['object'].hasOwnProperty('xml:lang') &&
    //         x['object']['xml:lang'] === 'en') {
    //         this.label = x['object']['value'];
    //       }
    //       else if (x['predicate']['value'] === 'http://www.w3.org/2004/02/skos/core#altLabel' &&
    //         x['object'].hasOwnProperty('xml:lang') &&
    //         x['object']['xml:lang'] === 'en') {
    //
    //         this.aliases.push(x['object']['value']);
    //       }
    //       else if (x['subject']['value'] === `http://www.wikidata.org/entity/${this.qid}` &&
    //         x['predicate']['value'].startsWith('http://www.wikidata.org/prop/direct/P')) {
    //         let p: string = x['predicate']['value'].split('/').pop();
    //         // let v = x['object']['value'].split('/').pop;
    //         // console.log(p, this.prop_name_map[p] );
    //
    //         if (tmp.hasOwnProperty(p)) {
    //           tmp[p].add(x['object']['value']);
    //         }
    //         else {
    //           tmp[p] = new Set([x['object']['value']]);
    //         }
    //       }
    //     }
    //
    //     for (let y of this.propsToDisplay) {
    //
    //       if (tmp.hasOwnProperty(y)) {
    //         let value = Array.from(tmp[y]).length > 1 ? Array.from(tmp[y]).join(', ') : Array.from(tmp[y]);
    //         this.table_data.push({'property': this.prop_name_map[y], 'value': value});
    //
    //         if (y == 'P662') {
    //           this.cidService.announceNewCID(value.toString());
    //         }
    //       }
    //
    //     }
    //
    //     if (!tmp.hasOwnProperty('P2175')) {
    //       this.retrieveLabels([]);
    //     }
    //     else {
    //       this.retrieveLabels(Array.from(tmp['P2175']).map((x: string) => x.split('/').pop()));
    //     }
    //     // Concatenate aliases so they can be rendered as one block
    //     this.concat_aliases = this.aliases.join(', ');
    //
    //   });
  }

  retrieveAssayData(): void {
    // console.log('retrieve assay data auth key', localStorage.getItem('auth_token'));
    this.http2.get(environment.host_url + '/assaydata', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('qid', this.qid)
    }).subscribe((r) => {
      let v = r.body;
      this.assayData = v;

      // for (let i of this.assayData){}

      // console.log('calbr assya data', b);


    },
      err => { }
    );

  }

  retrieveGVKData(): void {
    this.http2.get(environment.host_url + '/gvk_data', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('qid', this.qid)
    }).subscribe((r) => {
      let b = r.body;
      this.gvkData = b;
    });

  }

  set_cid(): void {
    for (let i of [this.gvkData[0], this.informaData[0], this.integrityData[0]]) {
      if ('PubChem CID' in i && ! this.cid) {
        this.cid = i['PubChem CID'].substring(3);
        this.cidService.announceNewCID(this.cid);

        break;
      }
    }


  }

  // if no cid exists, try to find one, announce it and trigger rendering of compound
  set_label(label: string): void {
    if (! this.label) {
      this.label = label;
      console.log('label set', this.label, label);
    }
  }

  retrieveData(): void {
    this.http2.get<VendorData>(environment.host_url + '/data', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json'), // TODO: revert
      // .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('qid', this.id)
    }).subscribe((r) => {
      let b = r.body[this.id];
      // console.log(b);
      this.reframeID = b.reframe_id;
      this.gvkData = [b.gvk];
      this.informaData = [b.informa];
      this.integrityData = [b.integrity];
      this.assayData = b.assay;

      this.set_cid();

      // extract aliases an make sure label is set
      let aliases = new Set();

      for(let i in this.gvkData[0]['drug_name']) {
        let name = this.gvkData[0]['drug_name'][i];
        this.set_label(name);
        aliases.add(name);
      }

      for(let i in this.gvkData[0]['synonyms']) {
        aliases.add(this.gvkData[0]['synonyms'][i]);
      }

      for(let i in this.integrityData[0]['drug_name']) {
        let name = this.integrityData[0]['drug_name'][i];
        this.set_label(name);
        aliases.add(name);
      }

      for(let i in this.informaData[0]['drug_name']) {
        let name = this.informaData[0]['drug_name'][i];
        this.set_label(name);
        aliases.add(name);
      }

      this.aliases = Array.from(aliases);


      // Sort aliases by name (case-insensitive)
      this.aliases = this.aliases.sort(function(a: string, b: string) {
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        } else {
          return -1;
        };
      })


      this.chemVendors = this.getChemVendors();
      // this.assayData.map(function(d) {
      //   return {
      //     chem_vendor: d.chem_vendor,
      //     chem_vendor_id: d.chem_vendor_id
      //   }
      // })
    });
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

  testStream() {
    const req = new HttpRequest('GET', environment.host_url + '/large', {
      responseType: 'text',
      reportProgress: true,
    });

    this.http2.request(req).subscribe(event => {
      if (event.type === HttpEventType.DownloadProgress) {

        console.log(event['partialText']);
        this.testJson = JSON.parse('[' + event['partialText'].slice(0, -1) + ']');
        console.log('event occured', JSON.parse('[' + event['partialText'].slice(0, -1) + ']'));

      } else if (event instanceof HttpResponse) {
        console.log('Data download complete!');
      }
      console.log('event2', event);
    });

  }

  showMore(clickEvent, qid: string): void {
    console.log('click workds', clickEvent);
    let elementID: string = clickEvent.srcElement.id;
    console.log(elementID, qid);

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
    console.log(query);
    this.http.request(query)
      .subscribe((res: Response) => {
        let tt = res.json();
        console.log(tt);

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

        // for(let x of gottlieb){
        //   if(x['drug_qid'] === `http://www.wikidata.org/entity/${this.qid}`){
        //     this.tableData.push({
        //       'compound_name': this.label,
        //       'compound_qid': this.qid,
        //       'disease_name': x['Disease name'],
        //       'disease_qid': x['disease_qid'],
        //       'reference': 'PMID:' + gottlieb_pub.pmid,
        //       'reference_qid': gottlieb_pub.qid
        //     })
        //   }
        // }
        // console.log(this.tableData);

        // this.graphData = this.prepareGraphData();
        // this.interactionTableDataService.announceNewCompoundData(this.tableData);
      });
  }

  prepareGraphData(): any {
    // console.log(data, 'hoo');
    let nodes = [{ data: { id: this.qid, name: this.label, faveColor: '#7a94fc', faveShape: 'rectangle' } }];
    let edges = [];
    let edge_color_pred: string = '#a84435';


    for (let x of this.tableData) {
      nodes.push({
        data: {
          id: x['disease_qid'],
          name: x['disease_name'],
          faveColor: '#fc4e2b',
          faveShape: 'ellipse'
        }
      });
      let edge_color = x['reference'].startsWith('PMID') ? edge_color_pred : '#06a809';
      edges.push({ data: { source: this.qid, target: x['disease_qid'], faveColor: edge_color } })
    }

    return { nodes, edges };
  }
}
