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
    filteredData: Object = [];
    assayValues: Object = [];
    assayDomain: Object = [];
    assayType: string = 'IC';
    currentPage: number = 0;
    private numPerPage: number = 15;
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


        // Pull out the limits for the *entire* dataset
        let assayValues = this.assayData.map(function(d) { return d.ac50; })
        this.assayDomain = [Math.max(...assayValues), Math.min(...assayValues)]

        // filter the data for the current page, assay type
        // filter assay type first, so that the number filters are just for that assay type
        this.filteredData = this.assayData.filter(d => d.assay_type == this.assayType)
        .filter(
        (d,i) =>
        i < this.numPerPage * (this.currentPage + 1) &&
        i >= this.numPerPage * this.currentPage)

      },
      err => {}
      );
    }


  }

// tester code based on https://keathmilligan.net/create-a-reusable-chart-component-with-angular-and-d3-js/
// export class AssayPlotsComponent implements OnInit {
//   private chartData: Array<any>;
//
//   constructor() {}
//
//   ngOnInit() {
//     // give everything a chance to get loaded before starting the animation to reduce choppiness
//     setTimeout(() => {
//       this.generateData();
//
//       // change the data periodically
//       setInterval(() => this.generateData(), 3000);
//     }, 1000);
//   }
//
//   generateData() {
//     this.chartData = [];
//     for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
//       this.chartData.push([
//         `Index ${i}`,
//         Math.floor(Math.random() * 100)
//       ]);
//     }
//   }
// }
