import { Component, OnInit, forwardRef, Inject, Injectable, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Http, Response } from "@angular/http";
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

// import { InteractionTableDataService } from "../interaction-table/interaction-table.component"

import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { AssayData, GVKData, IntegrityData, InformaData, VendorData, WDQSData, Compound, SearchResult, LoginState } from '../_models/index';
import { WDQService, BackendSearchService, LoginStateService, CompoundService } from '../_services/index';
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
  availData: Array<Object> = [];
  chemVendors: Array<Object> = [];
  table_data: Array<Object> = [];

  idData: Array<Object> = [];

  cmpdAvailData = [];

  // Parameters for similarity results
  num_similar_per_page: number = 3;
  // tanimoto: number = 0.85; // threshold for TM score
  // similarityResults: Object[];



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
    // private http: Http,
    private http2: HttpClient,
    private titleService: Title,
    private loginStateService: LoginStateService,
    private compoundService: CompoundService,
    // public searchSvc: BackendSearchService,
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
      console.log('routing... ')
      // this.qid = params['qid'];
      // this.id = params['id'];
      this.compoundService.idSubject.next(params['id']);
      this.compoundService.qidSubject.next(params['qid']);
      // this.buildData();
    });

    // Pass along available data binaries to app-available-data
    this.compoundService.availState.subscribe(availData => {
      console.log(availData)
      this.cmpdAvailData = availData;
    })

    // Generate SMILES for structure viewer
    this.compoundService.smilesState.subscribe(smiles => {
    console.log(smiles)
      this.smiles = smiles;
    })

    this.compoundService.nameState.subscribe(cmpdName => {
      if (cmpdName) {
        this.titleService.setTitle(cmpdName + " | reframeDB");
      }
    })



    //
    // // // check if logged in
    // this.loginStateService.loginState
    //   .subscribe((state: LoginState) => {
    //     console.log('subscribing...')
    //     console.log(state)
    //     // let init_state = this.loggedIn;
    //     this.loggedIn = state.loggedIn;
    //     // if(init_state && init_state !== this.loggedIn) {
    //     // // change detected
    //     this.buildData();
    //   })

  }




  ngOnInit() {
  }





  // if no cid exists, try to find one, announce it and trigger rendering of compound
  set_label(label: string): void {
    if (!this.label) {
      this.label = label;
      // console.log('label set', this.label, label);
    }
  }



  // // Main function to grab the data from the backend from the vendors and the assay results
  // retrieveData(): Promise<void> {
  //   return new Promise<any>((resolve, reject) => {
  //     if (this.loggedIn) {
  //
  //       this.http2.get<VendorData>(environment.host_url + '/data', {
  //         observe: 'response',
  //         // withCredentials: true,
  //         headers: new HttpHeaders()
  //           .set('Accept', 'application/json') // TODO: revert
  //           .set('Authorization', localStorage.getItem('auth_token')),
  //         params: new HttpParams()
  //           .set('qid', this.id)
  //       }).subscribe((r) => {
  //         let b = r.body[this.id];
  //         this.reframeID = b.reframe_id;
  //         this.gvkData = b.gvk;
  //         this.informaData = b.informa;
  //         this.integrityData = b.integrity;
  //         this.assayData = b.assay;
  //         console.log(b)
  //         // console.log(this.assayData)
  //
  //         // this.set_cid();
  //
  //         this.chemVendors = this.getChemVendors();
  //         resolve("Success with vendor data!");
  //       });
  //
  //     } else {
  //       // not logged in: grab the basics
  //       this.retrieveBasicInfo();
  //       // console.log(this.smiles)
  //
  //     }
  //
  //   })
  // }



  // showMore(clickEvent, qid: string): void {
  //   let elementID: string = clickEvent.srcElement.id;
  //
  //   this.displayShowMorePane = !this.displayShowMorePane;
  // }


}
