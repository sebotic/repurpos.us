import {Component, OnInit, forwardRef, Inject, Injectable, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, Response} from "@angular/http";

import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-assay-plots',
  templateUrl: './assay-plots.component.html',
  styleUrls: ['./assay-plots.component.css']
})
export class AssayPlotsComponent implements OnInit {
    assayData: Object = [];
    loggedIn: boolean;
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
      if(localStorage.getItem('auth_token')) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }

      this.retrieveAssayList();
    }

    retrieveAssayList(): void {
      this.http2.get(environment.host_url + '/assaydata_plot', {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Authorization', localStorage.getItem('auth_token')),
        params: new HttpParams()
          .set('aid', this.aid)
      }).subscribe((r) => {
        let v = r.body;

        this.assayData = v;

        console.log(this.assayData)
      },
      err => {}
      );
    }


  }
