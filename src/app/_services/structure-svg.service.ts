import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';


import { SafeHtml } from '@angular/platform-browser';

import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class StructureSvgService {

  constructor(public http: HttpClient) {
    if (!localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', '')
    }

  }

  getSVG(query: string, format: string): Observable<string> {
    // console.log('getting svg')
    // console.log(query)
    // console.log(format)

    // return this.http.get(environment.host_url + '/search', {
    return this.http.get(environment.host_url + '/compound_svg', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('structure', query)
        .set('format', format)
    }).pipe(
      map(item => {
        console.log(item)
        return item['body']['compound_svg'];
      }));
  }
}
