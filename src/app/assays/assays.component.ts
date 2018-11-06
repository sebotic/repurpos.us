import { Component, OnInit, forwardRef, Inject, Injectable, Input } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Http, Response } from "@angular/http";
import { Title, Meta } from '@angular/platform-browser';

import * as d3 from 'd3';
import * as chroma from 'chroma-js';

import { AssayDetails } from '../_models/index';
import { ColorPaletteService } from '../_services/index';

import { SciItalicizePipe } from '../_pipes/sci-italicize.pipe';

import {
  HttpClient, HttpHeaders
  // , HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,HttpResponse
} from "@angular/common/http";
import { environment } from "../../environments/environment";


@Component({
  selector: 'app-assays',
  // pipes: [SciItalicizePipe],
  templateUrl: './assays.component.html',
  styleUrls: ['./assays.component.scss']
})

export class AssaysComponent implements OnInit {
  assayList: AssayDetails[] = [];
  selAssays: AssayDetails[] = [];
  // store unique indications
  indicationList: string[];
  // map to indication colors
  indicColors: string[];
  typeColors: string[];
  isFiltered: boolean = false;
  filter: string;
  filter_color: string;

  meta_tags = [
    { property: 'og:title', content: 'reframeDB assay descriptions' },
    { name: 'description', content: 'List of assays performed on the reframeDB compound library' },
    { property: 'og:description', content: 'List of assays performed on the reframeDB compound library' },
    { property: 'og:url', content: 'https://reframedb.org/#/assays' }
  ];

  constructor(
    // private route: ActivatedRoute,
    private colorSvc: ColorPaletteService,
    private titleService: Title,
    // private http: Http,
    private http2: HttpClient,

    private meta: Meta) {
      for(let i=0; i < this.meta_tags.length; i++){
        this.meta.updateTag(this.meta_tags[i]);
      }

  }

  ngOnInit() {
    this.retrieveAssayList();
    this.titleService.setTitle("assays | reframeDB");
  }

  retrieveAssayList() {
    this.colorSvc.assaysState.subscribe((aList: AssayDetails[]) => {
      this.assayList = aList;
      this.selAssays = aList;
    })
  }

  getTypeColor(type: string) {
    let types = this.assayList.map((d: any) => d.assay_type.split(',')).reduce((acc, val) => acc.concat(val), []);

    // types = new Set(types);
    // types = Array.from(types);
    //
    let colors = this.colorSvc.uniqueColors;
    this.typeColors = [
      // 'grey', // cell
      colors['brown'], // cell
      colors['magenta'], // HCI
      colors['brand-red'], // cytotox
      colors['aquamarine'], // biochem
      colors['purple-blue'], // enzy
      colors['orange']] //reporter

    // this.typeColors = this.indicColors

    // hijack d3's color scale mapping
    let typeColorScale = d3.scaleOrdinal().domain(types).range(this.typeColors)
    let sel_color = chroma(typeColorScale(type));

    return ([sel_color.luminance(0.95), sel_color]);
  }

  filterIndic(indication: string) {
    this.selAssays = this.assayList.filter((d: any) => d.indication === indication);
    this.filter = indication;
    this.filter_color = <string>this.colorSvc.getIndicColor(indication)['bg1'];
    this.isFiltered = true;
  }

  filterType(type: string) {
    this.selAssays = this.assayList.filter((d: any) => d.assay_type.includes(type));
    this.filter = type;
    this.filter_color = this.getTypeColor(type)[1];
    this.isFiltered = true;
  }

  removeFilter() {
    this.selAssays = this.assayList;
    this.isFiltered = false;
  }

}
