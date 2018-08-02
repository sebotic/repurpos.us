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

import { LoginState, AvailableData } from '../_models/index';
import { WDQService, LoginStateService, CompoundService } from '../_services/index';
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
  loggedIn: boolean;
  showVendor: boolean = false;
  label: string;
  tableData: Array<Object> = [];
  aliases: Array<string> = [];
  chemVendors: Array<Object> = [];
  table_data: Array<Object> = [];

  idData: Array<Object> = [];

  cmpdAvailData: Array<AvailableData> = [];

  // Parameters for similarity results
  num_similar_per_page: number = 3;


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
      // console.log('routing... ')
      this.compoundService.idSubject.next({id: params['id'], qid: params['qid']});
    });

    // Pass along available data binaries to app-available-data
    this.compoundService.availState.subscribe((availData: AvailableData[]) => {
      // console.log(availData)
      this.cmpdAvailData = availData;
    })

    // Generate SMILES for structure viewer
    this.compoundService.smilesState.subscribe((smiles: string) => {
    // console.log(smiles)
      this.smiles = smiles;
    })

    this.compoundService.nameState.subscribe((cmpdName: string) => {
      if (cmpdName) {
        this.titleService.setTitle(cmpdName + " | reframeDB");
      }
    })

    loginStateService.isUserLoggedIn.subscribe((logState: LoginState) => {
      this.loggedIn = logState.loggedIn
    })
  }




  ngOnInit() {
  }


  // showMore(clickEvent, qid: string): void {
  //   let elementID: string = clickEvent.srcElement.id;
  //
  //   this.displayShowMorePane = !this.displayShowMorePane;
  // }


}
