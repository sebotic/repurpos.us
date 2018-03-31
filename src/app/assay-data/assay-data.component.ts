import {Component, OnInit, forwardRef, Inject, Injectable, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, Response} from "@angular/http";
import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";

import {AssayPlotsComponent} from '../assay-plots/assay-plots.component'
import { AssayDetails } from '../_models/assay-details';

import {environment} from "../../environments/environment";

@Component({
  selector: 'app-assay-data',
  templateUrl: './assay-data.component.html',
  styleUrls: ['./assay-data.component.css']
})
export class AssayDataComponent implements OnInit {
  assayDetails: AssayDetails;
  aid: string;

  constructor(
       private route: ActivatedRoute,
       private http: Http,
       private http2: HttpClient
     ) {
       route.params.subscribe(params => {
         this.aid = params['aid'];
       });
     }

  ngOnInit() {
    this.retrieveAssayList();
  }

  retrieveAssayList(): void {
    this.http2.get(environment.host_url + '/assay_details', {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
        // .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('aid', this.aid)
    }).subscribe((r) => {
      let v = r.body;

      this.assayDetails = v[0];
    },
    err => {}
    );
  }


}
