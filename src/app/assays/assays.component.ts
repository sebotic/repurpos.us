import {Component, OnInit, forwardRef, Inject, Injectable, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, Response} from "@angular/http";

import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Component({
  selector: 'app-assays',
  templateUrl: './assays.component.html',
  styleUrls: ['./assays.component.css']
})

export class AssaysComponent implements OnInit {
  assayList: Object = [];

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private http2: HttpClient
  ) {
  }

  ngOnInit() {
      this.retrieveAssayList();
  }


  retrieveAssayList(): void {
    this.http2.get(environment.host_url + '/assay_list', {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
    }).subscribe((r) => {
      let b = r.body;
      this.assayList = b;
    });
  }

}
