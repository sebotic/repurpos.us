import { Component, OnInit, forwardRef, Inject, Injectable, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { AssayPlotsComponent } from './assay-plots/assay-plots.component'
import { AssayDetails } from '../_models/assay-details';

import { environment } from "../../environments/environment";

@Component({
  selector: 'app-assay-data',
  templateUrl: './assay-data.component.html',
  styleUrls: ['./assay-data.component.scss']
})

export class AssayDataComponent implements OnInit {
  assayDetails: AssayDetails;
  aid: string;

  meta_tags = [];

  meta_url: string = 'https://reframedb.org/#/assays/';
  meta_title: string = ' assay data and protocol | reframeDB';
  meta_descrip: string = 'reframeDB assay data and protocol for ';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private http2: HttpClient,
    private meta: Meta
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
      params: new HttpParams()
        .set('aid', this.aid)
    }).subscribe((r) => {
      let v = r.body;
      // console.log(r)
      this.assayDetails = v[0];

      // Set meta tags for description, etc.
      this.meta_tags.push({name: 'description', content: this.meta_descrip + this.assayDetails.title_short});
      this.meta_tags.push({property: 'og:description', content: this.meta_descrip + this.assayDetails.title_short});
      this.meta_tags.push({property: 'og:url', content: this.meta_url + this.aid});
      this.meta_tags.push({property: 'og:title', content: this.assayDetails.title_short + this.meta_title });

      for(let i=0; i < this.meta_tags.length; i++){
        this.meta.updateTag(this.meta_tags[i]);
      }

      // Set title for the page
      this.titleService.setTitle(this.assayDetails.title_short + " | reframeDB");
    },
      err => { }
    );

  }

  onAnchorClick(anchor_tag: string) {
    let anchor_div = document.querySelector("#" + anchor_tag);
    if (anchor_div) {
      anchor_div.scrollIntoView();
    }
  }


}
