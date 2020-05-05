// Service to gather all the compound data.
// Checks if the user is logged in before returning either assay data

import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { combineLatest } from "rxjs/index";
import { debounceTime } from 'rxjs/operators';
import { environment } from "../../environments/environment";

import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { AssayData, GVKData, IntegrityData, InformaData, VendorData, WikiData, AvailableData, WDQSData, Compound, SearchResult, LoginState } from '../_models/index';
import { LoginStateService } from '../_services/login-state.service';
import { BackendSearchService } from '../_services/backendsearch.service';
// import { WDQService, BackendSearchService, LoginStateService } from '../_services/';

@Injectable({
  providedIn: 'root'
})
export class CompoundService {

  // Amount of time to wait between checking if ID/QID change and login state
  // Necessary to make sure not too many API calls are made simultaneously
  debouncetime = pipe(debounceTime(300));

  // --- IDs ---
  // ID holder (InChIkey or internal ID + QID) -- used to access the compound data
  // idStates is the event listener of idSubject which calls the backend API to get the data
  // idSubject is updated within compound-data.component, based on the URL route
  public idSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  idStates = this.idSubject.asObservable();

  // --- Assays ---
  // Assay data holder
  public assaysSubject: BehaviorSubject<AssayData[]> = new BehaviorSubject<AssayData[]>([]);
  assaysState = this.assaysSubject.asObservable();

  // --- Header data ---
  private main_label: string;
  private vendorName: string;
  public nameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  nameState = this.nameSubject.asObservable();

  // TODO: change RFM to bool
  public rfmSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  rfmState = this.rfmSubject.asObservable();
  public whoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  whoState = this.whoSubject.asObservable();

  private aliases: string[] = [];
  public aliasSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  aliasState = this.aliasSubject.asObservable();

  public chemSourceSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  chemSourceState = this.chemSourceSubject.asObservable();

  // --- SMILES ---
  // private wiki_smiles: string;
  // private vendor_smiles: string;
  private smiles: string;
  public smilesSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  smilesState = this.smilesSubject.asObservable();

  private chirality: string;
  public chiralitySubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  chiralityState = this.chiralitySubject.asObservable();

  // --- Similarity data ---
  // Parameters for similarity results
  tanimoto: number = 0.85; // threshold for TM score
  private similarityResults: Compound[];
  public similarSubject: BehaviorSubject<Compound[]> = new BehaviorSubject<Compound[]>([]);
  similarState = this.similarSubject.asObservable();

  // --- Vendor data ---
  // vendor data holders
  public vendorSubject: BehaviorSubject<VendorData> = new BehaviorSubject<VendorData>(<VendorData>[[{}], [{}], [{}]]);
  vendorState = this.vendorSubject.asObservable();

  // available data holders: if not logged in, gather what data is available.
  public availSubject: BehaviorSubject<AvailableData[]> = new BehaviorSubject<AvailableData[]>([]);
  availState = this.availSubject.asObservable();

  // --- Wikidata ---
  // Main biological/pharmacological data
  public wikiTableSubject: BehaviorSubject<WikiData[]> = new BehaviorSubject<WikiData[]>([]);
  wikiTableState = this.wikiTableSubject.asObservable();

  // Minor chemical / ID data
  public wikiIDsSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({ 'chem': [], 'ids': [] });
  wikiIDsState = this.wikiIDsSubject.asObservable();

  private table_data: WikiData[] = [];
  private idData: WikiData[] = [];
  private chemData: WikiData[] = [];
  public prop_name_map: Object = {};
  // from https://www.wikidata.org/wiki/Wikidata:List_of_properties/natural_science
  //   // propsLabelMap: Object = {
  // // biological/pharmacological activity
  // P129: "physically interacts with"
  // P2175: "medical condition treated"
  // P2868: "subject has role"
  // P3489: "pregnancy category"
  // P3780: "active ingredient in"
  //
  // // chem props
  // P274: "chemical formula"
  // P2017: "isomeric SMILES"
  // P233: "canonical SMILES"
  // P234: "InChI"
  // P235: "InChIKey"
  // P2275: "World Health Organisation International Nonproprietary Name"
  //
  // // ids
  // P231: "CAS Registry Number"
  // P232: "EC ID"
  // P267: "ATC code"
  // P486: "MeSH ID"
  // P592: "ChEMBL ID"
  // P595: "Guide to Pharmacology Ligand ID"
  // P652: "UNII"
  // P661: "ChemSpider ID"
  // P662: "PubChem CID"
  // P665: "KEGG ID"
  // P683: "ChEBI ID"
  // P715: "Drugbank ID"
  // P2115: "NDF-RT ID"
  // P2892: "UMLS CUI"
  // P3345: "RxNorm CUI"
  // P3636: "PDB ligand ID"
  // };
  idPropsToDisplay: string[] = ['P231', 'P232', 'P267', 'P486', 'P592', 'P595', 'P652', 'P661', 'P662', 'P665', 'P683', 'P715', 'P2115', 'P2892', 'P3345', 'P3636'];
  whoProp: string = 'P2275'; // WHO Name
  chemPropsToDisplay: string[] = ['P2017', 'P274', 'P233', 'P234', 'P235'];
  drugPropsToDisplay: string[] = ['P129', 'P2175', 'P2868', 'P3489', 'P3780'];

  propsToDisplay: Array<string> = this.idPropsToDisplay.concat(this.chemPropsToDisplay).concat(this.drugPropsToDisplay).concat(this.whoProp);

  showMoreProperties = ['P3489', 'P2868', 'P129', 'P3776', 'P3777', 'P3771'];

  excludeFromTableDisplay: Array<string> = ['P2275'];  // WHO Name
  // excludeFromTableDisplay: Array<string> = this.idPropsToDisplay;
  // excludeFromTableDisplay: Array<string> = this.idPropsToDisplay.filter(d => d !== 'P233');
  // excludeFromTableDisplay: Array<string> = ['P2175'];

  displayShowMorePane: boolean = false;

  constructor(
    private loginStateService: LoginStateService,
    private http2: HttpClient,
    public searchSvc: BackendSearchService,
  ) {



    // Listen for changes either to the login state or the route (e.g. ID)
    combineLatest(
      loginStateService.isUserLoggedIn,
      this.idStates,
      (log, ids) => ({ log, ids })
    )
      .pipe(this.debouncetime)
      .subscribe(
        data => {
          // console.log(data)
          // console.log(data.log)
          // console.log(data.ids)
          // console.log(data.qid)
          this.buildData(data['log'].loggedIn, data['ids']['id'], data['ids']['qid']);
        },
        err => console.error(err)
      );
  }

  // sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // --- MAIN FUNCTION ---
  buildData(loginState: boolean, id: string, qid: string) {
    // Series of nested promises
    // Wait for all the data to come back before making the call to get similarity data and append all aliases
    // First, reset variables and get the Wikidata labels (if haven't already)
    // Then, hit the Wikidata API to get Wikidata and the compound backend to get vendor + assay data
    // (... or, if not logged in, run the /search to get what data are available)
    // Lastly, grab the name, aliases, and call to get the similarity results.
    Promise.all([this.resetVars(), this.getWDVars()])
      // pause (for testing purposes)
      // .then(promises0 => {
      //   console.log(promises0)
      //   console.log('sleeping')
      //   return this.sleep(5000);
      // })
      .then(promises1 => {
        // console.log(promises1)

        return Promise.all([
          // Get Wikidata
          this.buildWD(qid),
          // Get vendor and assay data
          this.retrieveData(loginState, id)]).then(promises2 => {
            // console.log(promises2)

            // console.log('4 promises all resolved: id=' + id + '; qid=' + qid + '; login=' + loginState)
            this.getAliases(id);

            // Set SMILES
            // let smiles = this.wiki_smiles || this.vendor_smiles;
            // this.smilesSubject.next(smiles);

            // Run a query to get any compounds that are similar
            this.retrieveSimilarData(id, this.smiles);
          })
      })

  }

  resetVars(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('0 resetting')

      // Clear previous data, if it exists.  Prevents past states or duplicate data if both the login subscription service and the route params service are both called.
      this.main_label = '';
      this.vendorName = '';
      this.aliases = [];
      this.smiles = '';
      // this.wiki_smiles = '';
      // this.vendor_smiles = '';
      this.table_data = [];
      this.idData = [];
      this.chemData = [];

      this.similarityResults = [];

      // announce changes
      this.assaysSubject.next([]);
      this.nameSubject.next('');
      this.whoSubject.next('');
      this.smilesSubject.next('');
      this.rfmSubject.next('');
      this.aliasSubject.next([]);
      this.chemSourceSubject.next([]);
      this.similarSubject.next([]);
      this.availSubject.next([]);
      this.wikiTableSubject.next([]);
      this.wikiIDsSubject.next({ 'chem': [], 'ids': [] });
      this.vendorSubject.next(<VendorData>[[{}], [{}], [{}]]);

      // console.log('0 resetting ended')
      resolve("Clear vars");
    })
  }


  // --- WIKIDATA ---
  getWDVars(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('1 getting wd mapping')
      if (!localStorage.getItem('wd_vars')) {
        // Run query to determine which Wikidata variables to grab
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
          let b = r.body.results.bindings;

          console.log(b)

          for (let i of b) {
            let p: string = i['prop']['value'].split('/').pop();

            this.prop_name_map[p] = {};
            this.prop_name_map[p]['name'] = i['propLabel']['value'];

            if (i.hasOwnProperty('furl')) {
              this.prop_name_map[p]['url'] = i['furl']['value'];
            }
          }

          localStorage.setItem('wd_vars', JSON.stringify(this.prop_name_map));
          // console.log('1 wd mapping ended')
          resolve("WD property variables found!")
        },
          (err: any) => {
            console.log("WD get variables error")
            console.log(err)
            resolve('WD get variables error')
          })
      } else {
        this.prop_name_map = JSON.parse(localStorage.getItem('wd_vars'));
        // console.log('1 WD mapping ended w/o call')
        // console.log(this.prop_name_map)
        resolve("WD property variables already found!")
      }
    })
  }


  // Main function to gather Wikidata data
  buildWD(qid: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('2 retrieving wikidata')
      // console.log(qid)
      // console.log(this.prop_name_map)

      if (qid) {
        let q: string = `
      SELECT ?compound ?compoundLabel ?prop ?id ?idLabel WHERE {
        VALUES ?compound {wd:${qid}}
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
          let b = r.body.results.bindings;
          // console.log(b);

          // for some reason, the sparql endpoint returns a result for properties which actually not on that item
          let filtered = b.filter((d: Object) => d.hasOwnProperty('id'));
          // console.log(filtered)
          //
          // console.log(this.prop_name_map)

          let addTo = function(arr: WikiData[], propObj: Object, value, pid: string) {
            let prop = propObj['name'];
            let url = propObj['url'] ? propObj['url'].replace("$1", value) : null;

            // Check if already exists
            let idxProp = arr.map((d: Object) => d['property']).indexOf(prop);
            if ((idxProp > -1) && (arr.map((d: Object) => d['pid']).indexOf(pid) > -1)) {
              arr[idxProp]['values'].push(value);
            } else {
              arr.push({ 'property': prop, 'values': [value], 'pid': pid, 'url': url });
            }

          }

          for (let row of filtered) {
            let pid: string = row['prop']['value'].split('/').pop();
            let value = row['idLabel']['value'];
            let propObj = this.prop_name_map[pid];

            // pull out the aliases
            if (pid === 'core#altLabel') {
              this.aliases.push(value);
              // Pull out WHO name
            } else if (pid === this.whoProp) {
              this.main_label = value;
              this.whoSubject.next(this.main_label)
            } else if (this.idPropsToDisplay.includes(pid) && !this.excludeFromTableDisplay.includes(pid)) {
              addTo(this.idData, propObj, value, pid);
            } else if (this.chemPropsToDisplay.includes(pid) && !this.excludeFromTableDisplay.includes(pid)) {
              addTo(this.chemData, propObj, value, pid);
            }
            else if (!this.excludeFromTableDisplay.includes(pid)) {
              addTo(this.table_data, propObj, value, pid);
            }
          }

          // Sebastian code; rebuilt to be a bit simpler
          // for (let i of b) {
          //
          //   let p: string = i['prop']['value'].split('/').pop();
          //
          //   if (!i.hasOwnProperty('id')) {
          //     continue;
          //   }
          //
          //   // separate out aliases
          //   if (p === 'core#altLabel') {
          //     this.aliases.push(i['idLabel']['value']);
          //     continue;
          //   }
          //
          //   let qid: string = i['id']['value'];
          //   let v: string = i['idLabel']['value'];
          //
          //   if (p.startsWith('P')) {
          //     if (tmp.hasOwnProperty(p)) {
          //
          //       tmp[p]['values'].push(v);
          //       if (qid.startsWith('http://www.wikidata.org/entity/Q')) {
          //         tmp[p]['qids'].push(qid.split('/').pop());
          //       }
          //     }
          //     else {
          //       tmp[p] = {
          //         values: [v],
          //         qids: [],
          //         showMore: false,
          //         pid: ''
          //       };
          //
          //       if (qid.startsWith('http://www.wikidata.org/entity/Q')) {
          //         tmp[p]['qids'].push(qid.split('/').pop());
          //       }
          //     }
          //
          //   }
          // }

          // for (let y of this.propsToDisplay) {
          //
          //   if (tmp.hasOwnProperty(y)) {
          //     let sm: boolean = this.showMoreProperties.includes(y);
          //
          //
          //     if (this.prop_name_map[y] === 'World Health Organisation International Nonproprietary Name') {
          //       this.main_label = tmp[y]['values'];
          //       this.whoSubject.next(this.main_label)
          //     } else if (this.idPropsToDisplay.includes(y) && !this.excludeFromTableDisplay.includes(y)) {
          //       this.idData.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'showMore': sm, 'pid': y });
          //     }
          //     else if (!this.excludeFromTableDisplay.includes(y)) {
          //
          //       this.table_data.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'qids': tmp[y]['qids'], 'showMore': sm, 'pid': y });
          //     }
          //
          //   }
          // }

          // Pull out SMILES string
          // if (this.table_data.map((d: any) => d.property).indexOf('isomeric SMILES') > -1) {
          //   this.wiki_smiles = this.table_data.find((d: any) => d.property === "isomeric SMILES")['values'][0];
          // } else if (this.table_data.map((d: any) => d.property).indexOf('canonical SMILES') > -1) {
          //   this.wiki_smiles = this.table_data.find((d: any) => d.property === "canonical SMILES")['values'][0];
          // }

          // Send off the IDs, drug info-- and sort the entries.
          this.wikiTableSubject.next(<WikiData[]>this.table_data)
          this.wikiIDsSubject.next(<Object>
            {
              'chem': this.chemData,
              'ids': this.idData.sort((a: WikiData, b: WikiData) => a['property'] > b['property'] ? 1 : -1)
            });

          // console.log('2 retrieving wikidata ended')

          resolve("Success with WD!");
        },
          (err: any) => {
            // reset
            console.log('WD failure')
            console.log(err)
            resolve('WD retrieval error')
          });
      } else {
        // console.log('2 retrieving wikidata ended-- no QID')
        resolve("No QID found; WD exiting");
      }
    })

  }

  // --- BACKEND API CALL ---
  // Main function to grab the data from the backend from the vendors and the assay results
  retrieveData(loggedIn: boolean, id: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('3 retrieving data')
      if (id) {
        if (loggedIn) {
          this.http2.get<any>('/api/data', {
            // this.http2.get<VendorData>(environment.host_url + '/data', {
            observe: 'response',
            // withCredentials: true,
            headers: new HttpHeaders()
              .set('Accept', 'application/json')
              .set('Authorization', localStorage.getItem('auth_token')),
            params: new HttpParams()
              .set('qid', id)
              .set('origin', '*')
          }).subscribe((r) => {
            // search results
            let b = r.body[id];
            console.log(b);

            // make sure certain keys exist as Arrays
            let doc_keys = Array('reframe_id', 'gvk', 'informa', 'integrity');

            for (let x of doc_keys) {
              if (!b.hasOwnProperty(x)) {
                b[x] = [];
              }
            }

            // Is it a Reframe compound? --> compound-header
            console.log(b.reframe_id[0]);
            this.rfmSubject.next(b.reframe_id[0]);

            // Pull out assay data --> compound-assay-data
            this.assaysSubject.next(<AssayData[]>b.assay);

            // Pull out SMILES string
            this.smiles = b.smiles;
            this.smilesSubject.next(this.smiles);

            // Pull out SMILES string
            this.chirality = b.chirality;
            this.chiralitySubject.next(this.chirality);

            // Pull out chemical vendor source data --> compound-header
            this.chemSourceSubject.next(<Object[]>b.chem_vendors);

            // Pull out vendor data --> compound-vendor-data
            // b.gvk = [b.gvk]
            // b.integrity = [b.integrity]
            // b.informa = [b.informa]
            this.vendorSubject.next(<VendorData>[b.gvk, b.integrity, b.informa]);


            // pull out aliases & names
            this.getVendorHeaderInfo(b.gvk);
            this.getVendorHeaderInfo(b.informa);
            this.getVendorHeaderInfo(b.integrity);

            // console.log('3 retrieving data ended')
            resolve("Success with vendor data!");
          },
            (err: any) => {
              console.log("Error getting data from backend")
              console.log(err)
              resolve('Error fetching data from /data API')
            });

        } else {
          // not logged in: grab the basics
          // console.log('3b getting basic info')
          let prmse = this.retrieveBasicInfo(id);

          // Wait for promise from getting basic info before returning from getting vendor data
          resolve(prmse);

        }
      } else {
        // console.log('3 retrieving data ended w/ no ID found')
        resolve("No ID found; data retrieval exiting");
      }
    })
  }

  getVendorHeaderInfo(vendor_data: Object[]): void {
    if (vendor_data.length > 0 && Object.keys(vendor_data[0]).length > 0) {
      for (let compound of vendor_data) {
        this.aliases = this.aliases.concat(compound['drug_name']);
      }

      // Arbitrarily: choose the first name, first SMILES string
      this.vendorName = vendor_data[0]['drug_name'][0];
      // this.vendor_smiles = vendor_data[0]['smiles'];
    }
  }

  retrieveBasicInfo(id: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {

      if (id) {
        this.searchSvc.search(id, 'string')
          .subscribe(
            (results: SearchResult) => {

              if (results.data.length > 1) {
                console.log('too many results returned')
                console.log(results.data)
              }

              // console.log(results)
              let search_results = results.data[0];
              // console.log(search_results)
              // make sure the first result's id matches what it should be
              if (id === search_results.id) {

                this.main_label = search_results.main_label;
                // this.wiki_smiles = search_results.smiles;
                this.getAliases(id, search_results.aliases);

                // Is it a Reframe compound? --> compound-header
                // TODO: make sure this works when flip RFM id
                this.rfmSubject.next(search_results.reframeid);

                // send off SMILES structure
                this.smiles = search_results.smiles;
                this.smilesSubject.next(this.smiles);


                // Send off what data are available
                this.availSubject.next(search_results.properties);
              }
              // console.log('3b retrieving data ended w/ basic info')
              resolve("Basic data retrieved!");

            },
            (err: any) => {
              console.log('error in search')
              console.log(err)
              // console.log('3b retrieving data ended w/ ERROR')
              resolve("Error in basic data retrieval");
            }
          );
      } else {
        // console.log('3b retrieving data ended w/o ID in basic info')
        resolve("No id; exiting basic data retrieval");
      }
    })
  }

  getAliases(id: string, searchAliases: string[] = []) {
    // Set main label
    if (!this.main_label) {
      this.main_label = this.vendorName || id;
    }

    this.nameSubject.next(this.main_label);


    // extract aliases an make sure label is set
    let alias_arr: string[] = this.aliases;

    if (searchAliases.length > 0) {
      alias_arr = alias_arr.concat(searchAliases);
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

    this.aliasSubject.next(this.aliases);
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

  retrieveSimilarData(id: string, smiles: string): void {
    // console.log('SMILES: (sim) ' + smiles)
    // // reset
    // this.similarityResults = [];
    // if (!this.smiles) {
    //   if (this.table_data.map((d: any) => d.property).indexOf('isomeric SMILES') > -1) {
    //     this.smiles = this.table_data.find((d: any) => d.property === "isomeric SMILES")['values'][0];
    //   } else if (this.table_data.map((d: any) => d.property).indexOf('canonical SMILES') > -1) {
    //     this.smiles = this.table_data.find((d: any) => d.property === "canonical SMILES")['values'][0];
    //   } else {
    //     this.smiles = this.informaData['smiles'] || this.integrityData['smiles'] || this.gvkData['smiles'];
    //   }
    // }

    if (smiles) {
      this.searchSvc.searchSimilarity(smiles, this.tanimoto)
        .subscribe(
          (results: SearchResult) => {
            // console.log(results)

            // filter out the search query (e.g. the compound on the page that launched the search)
            this.similarityResults = results.data.filter((d: any) => d.id !== id);

            // remove closely related aliases / synonyms
            this.similarityResults.forEach((d: any) => {
              d['aliases'] = this.removeDupeAlias(d.aliases);
            });

            this.similarityResults = this.similarityResults.sort((a: any, b: any) => b.tanimoto - a.tanimoto);
            // console.log(this.similarityResults)
            this.similarSubject.next(<Compound[]>this.similarityResults);
            // console.log('4 finished getting similar data')

          },
          (err: any) => {
            console.log(err)
            // reset
            this.similarSubject.next(<Compound[]>[]);
          }
        );
    } else {
      // reset
      this.similarSubject.next(<Compound[]>[]);
    }


  }


  // retrieveLabels(disease_qids: Array<string>): void {
  //   let tmp_str: string = disease_qids.join(' wd:');
  //   let query: string = `
  //   https://query.wikidata.org/sparql?query=SELECT ?qid ?qidLabel WHERE {
  //   	VALUES ?qid {wd:${tmp_str}}
  //   	SERVICE wikibase:label { bd:serviceParam wikibase:language "en" .}
  //   }&format=json
  //   `;
  //   // console.log(query);
  //   this.http.request(query)
  //     .subscribe((res: Response) => {
  //       let tt = res.json();
  //       // console.log(tt);
  //
  //       if (disease_qids.length !== 0) {
  //
  //         for (let x of tt['results']['bindings']) {
  //           this.tableData.push({
  //             'compound_name': this.label,
  //             'compound_qid': this.qid,
  //             'disease_name': x['qidLabel']['value'],
  //             'disease_qid': x['qid']['value'],
  //             'reference': 'FDA',
  //             'reference_qid': ''
  //           })
  //         }
  //       }
  //     });
  // }



}
