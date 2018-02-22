// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {NgForm, NgModel} from '@angular/forms';
import {Component, OnInit, forwardRef, Inject, Injectable, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, Response} from "@angular/http";

// import {WDQService} from "../compound-search/compound-search.component"
// import { InteractionTableDataService } from "../interaction-table/interaction-table.component"

// import { gottlieb, gottlieb_pub } from '../../assets/gottlieb_data';
// import {CIDService} from "../ngl/ngl.component";
import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {environment} from "../../environments/environment";


// export interface WDQSData {
//   head: {vars: Array<string>};
//   results: {bindings: Array<Object>}
// }
//
// @NgModule({
//     imports: [ CommonModule],
//     declarations: []
//   })

@Component({
  // outputs: ['cid'],
  selector: 'app-assays',
  templateUrl: './assays.component.html',
  styleUrls: ['./assays.component.css']
})

export class AssaysComponent implements OnInit {
  assayList: Object = [];
  qid: string = "Q57055";


  constructor(
    // @Inject(forwardRef(() => WDQService)) public wd: WDQService,
    private route: ActivatedRoute,
    private http: Http,
    private http2: HttpClient
    // private interactionTableDataService: InteractionTableDataService,
    // private cidService: CIDService
  ) {
    route.params.subscribe(params => {
      this.qid = params['qid'];
    });
  }

  ngOnInit() {
      this.retrieveAssayList();
      console.log('assayList')
      console.log(this.assayList)

  }


  retrieveAssayList(): void {
    this.http2.get(environment.host_url + '/assay_list', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token'))
    }).subscribe((r) => {
    console.log('r')
      console.log(r)
      let b = r.body;
      this.assayList = b;
    });
    console.log(this.assayList)

  }

}
