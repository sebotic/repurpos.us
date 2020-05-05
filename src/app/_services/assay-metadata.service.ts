import { Injectable } from '@angular/core';

import {  HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

import { Observable } from 'rxjs';
import { map, tap, mergeMap, pluck } from 'rxjs/operators';

import { CitationService } from './citation.service';

import { AssayDetails } from '../_models';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AssayMetadataService {

  constructor(
    private http2: HttpClient,
    private citationSvc: CitationService,
  ) { }


  retrieveAssayList(aid: string): Observable<any> {
    return this.http2.get('/api/assay_details', {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('aid', aid)
    }).pipe(
      pluck("body"),
      mergeMap(assayDetails => this.citationSvc.getCitation([assayDetails[0].bibliography]).pipe(
      map(citations => {
        let assayMetadata = assayDetails[0];
        assayMetadata['citations'] = citations;

        return(assayMetadata);
      })
    )
  )

    )

    //   this.citationSvc.getCitation([this.assayDetails.bibliography]).subscribe(x => {
    //     this.assayDetails['citations'] = x;
    //   });
    //
    //   console.log(this.assayDetails)
    //
    //   // Set meta tags for description, etc.
    //   this.meta_tags.push({name: 'description', content: this.meta_descrip + this.assayDetails.title_short});
    //   this.meta_tags.push({property: 'og:description', content: this.meta_descrip + this.assayDetails.title_short});
    //   this.meta_tags.push({property: 'og:url', content: this.meta_url + this.aid});
    //   this.meta_tags.push({property: 'og:title', content: this.assayDetails.title_short + this.meta_title });
    //
    //   for(let i=0; i < this.meta_tags.length; i++){
    //     this.meta.updateTag(this.meta_tags[i]);
    //   }
    //
    //   // Set title for the page
    //   this.titleService.setTitle(this.assayDetails.title_short + " | reframeDB");
    // },
    //   err => { }
    // );

  }
}
