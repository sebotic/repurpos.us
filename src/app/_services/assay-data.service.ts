import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, combineLatest } from 'rxjs';

import { StructureSvgService } from "./structure-svg.service";
import { environment } from "../../environments/environment";
import { AssayData, NestedAssayData, NestedAssayValues } from "../_models";

import * as d3 from "d3";

@Injectable({
  providedIn: 'root'
})

export class AssayDataService {
  pixels_per_cmpd: number = 40;
  nestedData: NestedAssayData[];
  assayData: any = [];

  // Observable sources
  flatAssayDataSource = new BehaviorSubject<any[]>([]);
  assayDataSource = new BehaviorSubject<NestedAssayData[]>([]);
  filteredDataSource = new BehaviorSubject<NestedAssayValues[]>([]);
  assayDomainSource = new BehaviorSubject<number[]>([]);
  assayTypesSource = new BehaviorSubject<string[]>([]);

  // current values
  currentAssayTypeSource = new BehaviorSubject<string>("IC");
  currentAssayTypeSubject$ = this.currentAssayTypeSource.asObservable();

  currentPageSource = new BehaviorSubject<number>(0)
  currentPageSubject$ = this.currentPageSource.asObservable();

  totalPageSource = new BehaviorSubject<any>(null)
  totalPageSubject$ = this.totalPageSource.asObservable();


  // Observable streams
  flatAssayDataSubject$ = this.flatAssayDataSource.asObservable();
  assayDataSubject$ = this.assayDataSource.asObservable();
  filteredDataSubject$ = this.filteredDataSource.asObservable();
  assayDomainSubject$ = this.assayDomainSource.asObservable();
  assayTypesSubject$ = this.assayTypesSource.asObservable();

  constructor(
    private http2: HttpClient,
    private svgSvc: StructureSvgService
  ) {
    combineLatest(this.assayDataSubject$, this.currentAssayTypeSubject$, this.currentPageSubject$, this.totalPageSubject$).subscribe(
      ([assayData, currentType, currentPage, totalPages]) => {
        if (totalPages) {
          this.filterData(assayData, currentPage, totalPages[currentType].numPerPage, currentType);
        }
      })

  }

  retrieveAssayData(aid: string): void {
    // if (this.loggedIn) {
    this.http2.get('/api/data', {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('assay', aid)
    }).subscribe((r) => {
      this.assayData = <AssayData[]>r.body;
      console.log(this.assayData)

      // Pull out the limits for the *entire* dataset
      let assayValues = this.assayData.map(function(d: any) { return d.ac50; });
      let assayDomain = [Math.max(...assayValues), Math.min(...assayValues)];
      this.assayDomainSource.next(assayDomain);

      this.nestedData = this.nestData(this.assayData);
      this.flatAssayDataSource.next(this.assayData);
      this.assayDataSource.next(this.nestedData);

      // Calculate total number of pages per assay
      this.calcPages(this.nestedData, 500);

      return (this.nestedData);
      // this.filterData(this.currentPage, this.numPerPage, this.currentAssay);
    },
      error => {
        console.log('error in call to get assay data', error)
      }
    );
    // }
  }

  calcPages(nestedData, svg_height: number) {
    let assayTypes = nestedData.map(d => d.key);

    let results = [];

    nestedData.forEach(data => {
      let current_assay = data.key;

      // calculate number of compounds per page
      let num_per_page = Math.round(svg_height / this.pixels_per_cmpd);

      // calculate length of filtered data to generate pagination
      let num_cmpds = data.values.length;

      // calc number per page
      let num_pages = Math.ceil(num_cmpds / num_per_page);

      results[current_assay] = { totalPages: num_pages, numPerPage: num_per_page };
    })

    this.totalPageSource.next(results);
  }


  count_types(data, type: string): number {
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

  // helper: nest the data for filtering, etc.
  // to deal with the fact that for the cytotox assays, there are multiple values per inchi key / unique id
  nestData(data: AssayData[]) {
    let nested = d3.nest()
      .key((d: AssayData) => d.assay_type)
      .key((d: AssayData) => d.calibr_id)
      .rollup(function(values: AssayData[]): any {
        return {
          count: values.length,
          avg: d3.mean(values, d => d.ac50),
          min: d3.min(values, d => d.ac50),
          ac50: values.map(d => d.ac50),
          ac_imprecise: values.some(d => d.ac_precision != ""),
          ac_precision: values.map(d => d.ac_precision),
          efficacy: values.map(d => d.efficacy),
          r_sq: values.map(d => d.r_sq),
          url: values[0].url.replace("/#/", "/"),
          assay_type: values[0].assay_type,
          name: values[0].name,
          id: values[0].calibr_id

        }
      })
      .entries(data)
      // sort keys (IC or EC)
      .sort((a: any, b: any) => d3.descending(a.values.length, b.values.length));

    // Sort by average values within each nest.
    for (let i = 0; i < nested.length; i++) {
      nested[i].values = nested[i].values.sort((a: any, b: any) => a.value.avg - b.value.avg);
    }

    // Pass along the assayTypes domain and current assay
    this.assayTypesSource.next(nested.map(d => d.key));
    this.currentAssayTypeSource.next(nested[0].key);

    console.log(nested)
    return (nested);
  }

  // helper: filter the data
  filterData(assayData, currentPage, numPerPage, assayType) {
    if (assayData && assayData.length > 0) {
      let filtered = assayData.filter(d => d.key === assayType);

      // Filter by assay type
      if (filtered.length > 1) {
        console.log("ERROR! More than a single IC/EC type returned from filtering")
      }

      // Filter by page number
      let result = filtered[0].values.slice(numPerPage * currentPage, numPerPage * (currentPage + 1))
      console.log(result)

      // append SVGs for tooltips
      result.forEach(cmpd => {
        this.svgSvc.getSVG(cmpd.value.id, "inchikey")
          .subscribe(
            (results: string) => {
              cmpd.value['svg'] = results;
            },
            (err: any) => {
              console.log(err)
            }
          );
      })

      this.filteredDataSource.next(result);
    }
  }

  clearAssayData() {
    this.flatAssayDataSource.next([]);
    this.assayDataSource.next([]);
    this.filteredDataSource.next([]);
    this.assayDomainSource.next([]);
    this.assayTypesSource.next([]);

    // current values
    // this.currentAssayTypeSource.next("IC")
    this.currentPageSource.next(0);
    this.totalPageSource.next(null);
  }
}
