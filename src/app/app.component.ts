import {Component, Inject, Injectable, OnInit} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  Router,
  Routes
} from '@angular/router';

import { RouteDef } from "./menu-bar/menu-bar.component";
import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from "./compound-data/compound-data.component";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";


let routeDef: RouteDef[] = [
  {label: 'Compound Search', name: 'Root', path: '', component: CompoundSearchComponent},
  {label: 'Compound Data', name: 'compound_data', path: 'compound_data/:qid', component: CompoundDataComponent },

];


export const routes: Routes = [
  { path: '', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'compound_data/:qid', component: CompoundDataComponent, pathMatch: 'full' }
];

@Injectable()
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  routeDef: RouteDef[];

  constructor(private router: Router, @Inject(DOCUMENT) private document: any, private http: HttpClient,) {
    this.routeDef = routeDef;
  }

  ngOnInit(): void{
    console.log(this.document.location.pathname);
    console.log(this.document.location.href);

    if (this.document.location.href.startsWith('https://repurpos') && this.document.location.href.includes('oauth_verifier')) {
      this.document.location.href = 'http://localhost:4200/?' + this.document.location.href.split('?')[1];
    }
    if (this.document.location.href.includes('oauth_verifier')) {
      let url: string = 'http://localhost:5000/oauthcomplete?' + this.document.location.href.split('?')[1];
      console.log('entered', url);

      this.http.get(url, {
          observe: 'response',
          withCredentials: true,
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
        }

      ).subscribe((res) => {
        // do whatever with your response
        let bd = res.body;

        console.log(JSON.stringify(bd));

        this.http.get('http://localhost:5000/authenticated', {
          observe: 'response',
          withCredentials: true,
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
        }).subscribe((r) => {
          let b = r.body;
          console.log(JSON.stringify(b));

        });

        // return this.http.post('http://localhost:5000/write',{
        //     observe: 'response',
        //     params: new HttpParams()
        //       .set('id', 'Q423111')
        //       // .set('origin', 'http://localhost')
        //       .set('origin', 'https://repurpos.us')
        //       .set('action', 'wbeditentity')
        //       .set('format', 'json')
        //     ,
        //
        //     headers: new HttpHeaders()
        //       .set('Authorization', this.auth_creds)
        //       .set('content-type', 'application/json')
        //       .set('charset', 'utf-8'),
        //   }
        //
        // ).subscribe((re) => {
        //     // do whatever with your response
        //     // console.log(res['error']);
        //
        //     // console.log(res['success']);
        //     // let bd2 = re.body;
        //     //
        //     console.log(JSON.stringify(re));
        //     // console.log(re.status);
        //   },
        //   (err: HttpErrorResponse) => {
        //     console.log(err.error.message);
        //     console.log(JSON.stringify(err));
        //     console.log(err.status);
        //   }
        // );

          // this.http.get('https://www.wikidata.org/w/api.php', {
          //     params: new HttpParams()
          //       .set('ids', 'Q423111')
          //       .set('action', 'wbgetentities')
          //       .set('format', 'json')
          //       .set('origin', '*')
          //     ,
          //
          //     headers: new HttpHeaders()
          //       // .set('content-type', 'application/x-www-form-urlencoded')
          //       .set('charset', 'utf-8'),
          //   }
          //
          // )
          //
          //   .subscribe((res) => {
          //       // do whatever with your response
          //       console.log(res);
          //     },
          //
          //     err => {console.log(err);}
          //
          //   );

      })

    }
  }
}
