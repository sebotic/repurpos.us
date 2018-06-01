import { Component, OnInit, OnChanges, forwardRef, Inject, ViewChild, Injectable, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Response } from "@angular/http";

import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { environment } from "../../../environments/environment";

import { AssayPaginationComponent } from '../assay-pagination/assay-pagination.component'

@Component({
  selector: 'app-assay-plots',
  templateUrl: './assay-plots.component.html',
  styleUrls: ['./assay-plots.component.css']
})

export class AssayPlotsComponent implements OnInit {
  loggedIn: boolean;
  aid: string;
  assayData: any = [];
  filteredData: any = [];
  tooltipData: any = {};
  assayValues: any;
  assayDomain: Array<number>;
  assayTypes: Array<string> = [];
  currentAssay: string;
  currentPage: number = 0;
  numPerPage: number;


  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private http2: HttpClient
  ) {
    route.params.subscribe(params => {
      this.aid = params['aid'];
    });
  }

  @ViewChild(AssayPaginationComponent)
  private onAssayChangedComp: any = AssayPaginationComponent;


  ngOnInit() {
    if (localStorage.getItem('auth_token')) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }

    this.retrieveAssayList();
  }


  // Event listener if the IC/EC50 tab is clicked
  // change what data are filtered.
  onAssayChanged(newAssayType: string): void {
    this.currentAssay = newAssayType;

    this.filterData();
  }

  // tell page number to reset.
  onAssayChanged2(newAssayType: string): void {
    this.onAssayChangedComp.resetPage();
  }

  // Event listener for tooltip
  showTooltip(tooltip_data: any): void {
    this.tooltipData = tooltip_data;
  }

  // Event listener to set the number per page
  setNumPage(num_per_page: number): void {
    console.log("SETTING")
    console.log(num_per_page)
    this.numPerPage = num_per_page;

    this.filterData();
  }

  // Event listener if the page number is changed
  onPageChanged(newPageNum: number): void {
    this.currentPage = newPageNum;

    this.filterData();
  }

  // helper: filter the data
  filterData() {
    this.filteredData = this.assayData.filter(d => d.assay_type == this.currentAssay)
      .filter(
        (d, i) =>
          i < this.numPerPage * (this.currentPage + 1) &&
          i >= this.numPerPage * this.currentPage
      );
  }

  ngOnChanges() {
    this.retrieveAssayList();
  }

  retrieveAssayList(): void {
    if (this.loggedIn) {
      this.http2.get(environment.host_url + '/assaydata_plot', {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Authorization', localStorage.getItem('auth_token')),
        params: new HttpParams()
          .set('aid', this.aid)
      }).subscribe((r) => {
        // assign data to assayData object
        let v = r.body;
        this.assayData = v;
        // console.log(this.assayData)

        // Pull out the limits for the *entire* dataset
        let assayValues = this.assayData.map(function(d) { return d.ac50; });
        this.assayDomain = [Math.max(...assayValues), Math.min(...assayValues)];

        // Find the largest number of assay data types
        let ic_count = this.count_types(this.assayData, 'IC');
        let ec_count = this.count_types(this.assayData, 'EC');

        if (ic_count > ec_count) {
          this.assayTypes[0] = 'IC';

          if (ec_count > 0) {
            this.assayTypes[1] = 'EC';
          }
        } else {
          this.assayTypes[0] = 'EC';
          if (ic_count > 0) {
            this.assayTypes[1] = 'IC';
          }
        }
        // set current assay: default == largest number
        if (!this.currentAssay) {
          this.currentAssay = this.assayTypes[0];
        }

        this.filterData();

      },
        error => console.log('error in call to get assay data', error)

      );
    }
  }

  // <<< count_types(array, type) >>>
  count_types(data, type): any {

    let array = data.map(function(d) {
      return d.assay_type;
    })

    let counter = 0;

    for (var i = 0; i < array.length; i++) {
      if (array[i] === type) {
        counter++;
      }
    }
    return counter;
  }


}
