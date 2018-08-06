// Service to gather all the compound data.
// Checks if the user is logged in before returning either assay data

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { combineLatest } from "rxjs/index";
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

  // --- IDs ---
  // ID holder (InChIkey or internal ID) -- used to access the compound data
  // idState is the event listener of idSubject which calls the backend API to get the data
  // idSubject is updated within compound-data.component, based on the URL route
  public idSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  idStates = this.idSubject.asObservable();
  // public qidSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // qidState = this.qidSubject.asObservable();

  // --- Assays ---
  // Assay data holder
  public assaysSubject: BehaviorSubject<AssayData[]> = new BehaviorSubject<AssayData[]>([]);
  assaysState = this.assaysSubject.asObservable();

  // --- Header ---
  private main_label: string;
  private vendorName: string;
  public nameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  nameState = this.nameSubject.asObservable();

  // TODO: change RFM to bool
  public rfmSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  rfmState = this.rfmSubject.asObservable();
  public whoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  whoState = this.whoSubject.asObservable();

  private aliases: string[] = [];
  public aliasSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  aliasState = this.aliasSubject.asObservable();

  public chemSourceSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  chemSourceState = this.chemSourceSubject.asObservable();

  // --- SMILES ---
  private wiki_smiles: string;
  private vendor_smiles: string;
  public smilesSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  smilesState = this.smilesSubject.asObservable();

  // --- Similarity data ---
  // Parameters for similarity results
  tanimoto: number = 0.85; // threshold for TM score
  private similarityResults: Compound[];
  public similarSubject: BehaviorSubject<Compound[]> = new BehaviorSubject<Compound[]>([]);
  similarState = this.similarSubject.asObservable();

  // --- Vendor data ---
  // vendor data holders
  public vendorSubject: BehaviorSubject<VendorData> = new BehaviorSubject<VendorData>(<VendorData>[{}, {}, {}]);
  vendorState = this.vendorSubject.asObservable();

  // available data holders: if not logged in, gather what data is available.
  public availSubject: BehaviorSubject<AvailableData[]> = new BehaviorSubject<AvailableData[]>([]);
  availState = this.availSubject.asObservable();

  // --- Wikidata ---
  public wikiTableSubject: BehaviorSubject<WikiData[]> = new BehaviorSubject<WikiData[]>([]);
  wikiTableState = this.wikiTableSubject.asObservable();

  private table_data: WikiData[] = [];
  prop_name_map: Object = {};
  // from https://www.wikidata.org/wiki/Wikidata:List_of_properties/natural_science
  //   // propsLabelMap: Object = {
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
  idPropsToDisplay: Array<string> = ['P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665',
    'P652', 'P595', 'P3636', 'P232', 'P2275', 'P3350', 'P267', 'P2892', 'P3345', 'P486', 'P2115', 'P3098', 'P2874'];

  propsToDisplay: Array<string> = this.idPropsToDisplay.concat(["P274", "P233", "P2017", "P234", "P235", "P3780", "P3776", "P3777", "P3771", "P129", "P3489", "P2868", "P2175", "P2177", "P2993", "P3772", "P3773", "P3774", "P3775", "P3776", "P3777", "P3778", "P3779", "P924", "P3364"]);
  //   propsToDisplay: Array<string> = this.idPropsToDisplay.concat(['P274', 'P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665', 'P233', 'P2017',
  //     'P234', 'P235', 'P652', 'P595', 'P3636', 'P232', 'P2275', 'P3350', 'P267', 'P2892', 'P3345', 'P486', 'P2115', 'P3780',
  //     'P3776', 'P3777', 'P3771', 'P129', 'P3489', 'P2868', 'P2175', 'P2177', 'P2993',
  // 'P3772', 'P3773', 'P3774', 'P3775', 'P3776', 'P3777', 'P3778', 'P3779', 'P924',
  // // stereoisomer
  //     'P3364']);

  showMoreProperties = ['P3489', 'P2868', 'P129', 'P3776', 'P3777', 'P3771'];

  excludeFromTableDisplay: Array<string> = [];//['P2275'];  // WHO Name
  // excludeFromTableDisplay: Array<string> = this.idPropsToDisplay;
  // excludeFromTableDisplay: Array<string> = this.idPropsToDisplay.filter(d => d !== 'P233');
  // excludeFromTableDisplay: Array<string> = ['P2175'];

  displayShowMorePane: boolean = false;

  constructor(
    private loginStateService: LoginStateService,
    private http2: HttpClient,
    public searchSvc: BackendSearchService,
    // private route: ActivatedRoute,
    // private router: Router,
  ) {



    // Listen for changes either to the login state or the route (e.g. ID)
    combineLatest(
      loginStateService.isUserLoggedIn,
      this.idStates,

      (log, ids) => ({ log, ids })
    ).subscribe(
      data => {
        // console.log(data.log)
        // console.log(data.ids)
        // console.log(data.qid)
        this.buildData(data.log.loggedIn, data.ids['id'], data.ids['qid']);
      },
      err => console.error(err)
    );

  }

  // --- MAIN FUNCTION ---
  buildData(loginState: boolean, id: string, qid: string) {

    // Wait for all the data to come back before making the call to get similarity data and append all aliases
    return [
    // clear results
    this.resetVars(),
    // Tell Wikidata what want to grab
    this.getWDVars(),
    // Get Wikidata
    this.buildWD(qid),
    // Get vendor and assay data
    this.retrieveData(loginState, id)].reduce((promiseChain, currentTask) => {
      // console.log(promiseChain)
      // console.log(currentTask)
      return promiseChain.then(chainResults =>
        currentTask.then((currentResult) => {
          // console.log('currentResult')
          // console.log(chainResults)
          // console.log(currentResult)
          return [...chainResults, currentResult]
        }
        )
      );
    }, Promise.resolve([])).then(allData => {
      // console.log('4 promises all resolved: id=' + id + '; qid=' + qid + '; login=' + loginState)
      // console.log(allData)
      this.getAliases();

      // Set SMILES
      let smiles = this.wiki_smiles || this.vendor_smiles;
      this.smilesSubject.next(smiles);

      // Run a query to get any compounds that are similar
      this.retrieveSimilarData(id, smiles);

    })
    // Parallel version: problem == aliases not returned correctly.
    // Wait for all the data to come back before making the call to get similarity data and append all aliases
    // Promise.all([this.resetVars(), this.buildWD(qid), this.retrieveData(loginState, id)]).then(allData => {
    //   // Interdependent Wikidata / backend API calls
    //
    //   // Merge together Wikidata + vendor aliases & set the label name
    //   this.getAliases();
    //
    //   // Set SMILES
    //   let smiles = this.wiki_smiles || this.vendor_smiles;
    //   console.log(smiles)
    //   this.smilesSubject.next(smiles);
    //
    //   // Run a query to get any compounds that are similar
    //   this.retrieveSimilarData(id, smiles);
    //
    // })
  }

  resetVars(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('0 resetting')
      // Clear previous data, if it exists.  Prevents past states or duplicate data if both the login subscription service and the route params service are both called.
      this.main_label = '';
      this.vendorName = '';
      this.aliases = [];
      // this.tableData = [];
      this.wiki_smiles = '';
      this.vendor_smiles = '';
      this.table_data = [];

      this.similarityResults = [];
      // this.idData = [];

      // announce changes
      // idSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
      // public qidSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

      this.assaysSubject.next([]);
      this.nameSubject.next('');
      this.whoSubject.next('');
      this.smilesSubject.next('');
      this.rfmSubject.next(false);
      this.aliasSubject.next([]);
      this.chemSourceSubject.next([]);
      this.similarSubject.next([]);
      this.availSubject.next([]);
      this.wikiTableSubject.next([]);
      this.vendorSubject.next(<VendorData>[{}, {}, {}]);

      // console.log('0 resetting ended')
      // setTimeout(resolve, 100, 'foo');
      resolve("Clear vars");
    })
  }

  // resetVars(): Promise<void> {
  //   return new Promise<any>((resolve, reject) => {
  //   setTimeout(resolve, 100, 'foo');
  // });


  // --- WIKIDATA ---
  getWDVars(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
  // console.log('1 getting wd mapping')
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
      let b = r.body;

      for (let i of b.results.bindings) {
        let p: string = i['prop']['value'].split('/').pop();

        this.prop_name_map[p] = i['propLabel']['value'];
      }
      // console.log('1 wd mapping ended')
      resolve("WD property variables found!")
    })
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
          let b = r.body;
          let tmp: Object = {};

          for (let i of b.results.bindings) {
            // this.label = i['compoundLabel']['value'];

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

              // Pull out WHO name
              if (this.prop_name_map[y] === 'World Health Organisation International Nonproprietary Name') {
                this.main_label = tmp[y]['values'];
                this.whoSubject.next(this.main_label)
              }


              if (this.idPropsToDisplay.includes(y) && !this.excludeFromTableDisplay.includes(y)) {
                // this.idData.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'showMore': sm, 'pid': y });
              }
              else if (!this.excludeFromTableDisplay.includes(y)) {

                this.table_data.push({ 'property': this.prop_name_map[y], 'values': tmp[y]['values'], 'qids': tmp[y]['qids'], 'showMore': sm, 'pid': y });
              }

            }
          }

          // Pull out SMILES string
          if (this.table_data.map((d: any) => d.property).indexOf('isomeric SMILES') > -1) {
            this.wiki_smiles = this.table_data.find((d: any) => d.property === "isomeric SMILES")['values'][0];
          } else if (this.table_data.map((d: any) => d.property).indexOf('canonical SMILES') > -1) {
            this.wiki_smiles = this.table_data.find((d: any) => d.property === "canonical SMILES")['values'][0];
          }

          this.wikiTableSubject.next(<WikiData[]>this.table_data)

          // if (!tmp.hasOwnProperty('P2175')) {
          //   this.retrieveLabels([]);
          // }
          // else {
          //   this.retrieveLabels(Array.from(tmp['P2175']['qids']).map((x: string) => x.split('/').pop()));
          // }
          //
          // console.log('2 retrieving wikidata ended')

          resolve("Success with WD!");
        });
      } else {
        // console.log('2 retrieving wikidata ended')
        resolve("No QID found; WD exiting");
      }
    })

  }

  // --- BACKEND API CALL ---
  // Main function to grab the data from the backend from the vendors and the assay results
  retrieveData(loggedIn: boolean, id: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      if (id) {
        if (loggedIn) {
            // console.log('3 retrieving data')
          this.http2.get<any>(environment.host_url + '/data', {
            // this.http2.get<VendorData>(environment.host_url + '/data', {
            observe: 'response',
            // withCredentials: true,
            headers: new HttpHeaders()
              .set('Accept', 'application/json')
              .set('Authorization', localStorage.getItem('auth_token')),
            params: new HttpParams()
              .set('qid', id)
          }).subscribe((r) => {
            // search results
            let b = r.body[id];

            // Is it a Reframe compound? --> compound-header
            this.rfmSubject.next(b.reframe_id.length > 0);

            // Pull out assay data --> compound-assay-data
            this.assaysSubject.next(<AssayData[]>b.assay);
            console.log(b)

            // Pull out chemical vendor source data --> compound-header
            this.chemSourceSubject.next(<Object[]>b.chem_vendors);

            // Pull out vendor data --> compound-vendor-data
            this.vendorSubject.next(<VendorData>[b.gvk, b.integrity, b.informa])

            // pull out aliases & names
            // Main label is preferentially: WHO Name, then Integrity, then informa, then GVK
            if (Object.keys(b.gvk).length > 0) {
              this.aliases.concat(b.gvk.synonyms).concat(b.gvk.drug_name);
              this.vendorName = b.gvk.drug_name;
              this.vendor_smiles = b.gvk.smiles;
            }
            if (Object.keys(b.informa).length > 0) {
              this.aliases.concat(b.informa.drug_name);
              this.vendorName = b.informa.drug_name;
              this.vendor_smiles = b.informa.smiles;
            }
            if (Object.keys(b.integrity).length > 0) {
              this.aliases.concat(b.integrity.drug_name);
              this.vendorName = b.integrity.drug_name;
              this.vendor_smiles = b.integrity.smiles;
            }

            // console.log('3 retrieving data ended')
            resolve("Success with vendor data!");
          });

        } else {
          // not logged in: grab the basics
          // console.log('3 getting basic info')
          let prmse = this.retrieveBasicInfo(id);
          // console.log('3 retrieving data ended w/ basic info')
          // Wait for promise from getting basic info before returning from getting vendor data
          resolve(prmse);

        }
      }
    })
  }

  retrieveBasicInfo(id: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {

    if (id) {
      this.searchSvc.search(id)
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
              this.wiki_smiles = search_results.smiles;
              this.getAliases(search_results.aliases);

              // Is it a Reframe compound? --> compound-header
              // TODO: make sure this works when flip RFM id
              this.rfmSubject.next(search_results.reframeid);


              // Send off what data are available
              this.availSubject.next(search_results.properties);
            }
            resolve("Basic data retrieved!");

          },
          (err: any) => {
            console.log('error in search')
            resolve("Error in basic data retrieval");
          }
        );
    } else {
      resolve("No id; exiting basic data retrieval");
    }
  })
  }

  getAliases(searchAliases: string[] = []) {
    // Set main label
    if (!this.main_label) {
      this.main_label = this.vendorName;
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
