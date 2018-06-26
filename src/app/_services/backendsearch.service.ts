import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { SearchResult } from '../_models/index';

import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class BackendSearchService {

  constructor(public http: HttpClient) {
    if (!localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', '')
    }

  }

  search(query: string): Observable<SearchResult> {

    return this.http.get(environment.host_url + '/search', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('query', query)
        .set('type', 'string')
    }).pipe(
      map(item => {
        return new SearchResult({ data: item });
      }));
  }

  searchStructExact(query: string, mode: string): Observable<SearchResult> {

    return this.http.get(environment.host_url + '/search', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('query', query)
        .set('type', 'structure')
        .set('mode', mode)
    }).pipe(
      map(item => {
        return new SearchResult({ data: item });
      }));
  }

  searchSimilarity(query: string, tanimoto: number): Observable<SearchResult> {

    return this.http.get(environment.host_url + '/search', {
      observe: 'response',
      // withCredentials: true,
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('auth_token')),
      params: new HttpParams()
        .set('query', query)
        .set('type', 'structure')
        .set('tanimoto', tanimoto.toString())
        .set('mode', 'similarity')
    }).pipe(
      map(item => {
        return new SearchResult({ data: item });
      }));
  }
}
