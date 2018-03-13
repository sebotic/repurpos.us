import {Component, Inject, Injectable, OnInit} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  Router,
  Routes
} from '@angular/router';
import { Subscription } from 'rxjs/subscription';

import { RouteDef } from "./menu-bar/menu-bar.component";
import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from "./compound-data/compound-data.component";
import { AboutComponent } from "./about/about.component";
import { AssaysComponent } from "./assays/assays.component";
import { AssayDataComponent } from "./assay-data/assay-data.component";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {isDefined} from "@angular/compiler/src/util";
import {environment} from "../environments/environment";
import { LoginStateService } from './_services/index';
import { LoginState } from './_models/index';


let routeDef: RouteDef[] = [
  {label: 'Compound Search', name: 'Root', path: '', component: CompoundSearchComponent},
  {label: 'Compound Data', name: 'compound_data', path: 'compound_data/:qid', component: CompoundDataComponent },
  {label: 'about', name: 'about', path: 'about', component: AboutComponent },
  {label: 'Assay Descriptions', name: 'assays', path: 'assays', component: AssaysComponent },
  {label: 'Assay Data', name: 'assay_data', path: 'assays/:aid', component: AssayDataComponent }
];


export const routes: Routes = [
  { path: '', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'assays', component: AssaysComponent, pathMatch: 'full' },
  { path: 'assays/:aid', component: AssayDataComponent, pathMatch: 'full' },
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
  loginBox: boolean = false;
  loggedIn: boolean = false;
  private loginSubscription: Subscription;

  constructor(private router: Router, @Inject(DOCUMENT) private document: any, private http: HttpClient, private loginStateService: LoginStateService) {
    this.routeDef = routeDef;
  }

  login(){
    this.http.post(environment.host_url + '/auth/login', {"email": "sebastian.burgstaller@gmail.com", "password": "test"}, {
        observe: 'response',
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let credentials = re.body;
        console.log(credentials['auth_token']);
        localStorage.setItem('auth_token', credentials['auth_token']);

        console.log(JSON.stringify(re));
        // console.log(re.status);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      }
    );
  }

  showLogin() {
    this.loginBox = !this.loginBox;
  }

  ngOnInit(): void {
    // subscribe to the login state
    this.loginSubscription = this.loginStateService.loginState
                                .subscribe((state: LoginState) => {
                                  this.loggedIn = state.loggedIn;
                                });
    // console.log(this.document.location.pathname);
    // console.log(this.document.location.href);

    /*
     * This seems to be legacy and has been moved to user-login.component
    if (localStorage.getItem('auth_token') ){
      this.http.get(environment.host_url + '/auth/status', {
          observe: 'response',
          headers: new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Authorization', localStorage.getItem('auth_token'))
        }

      ).subscribe((re) => {
          let credentials = re.body;
          // console.log(credentials['auth_token']);
          // localStorage.setItem('auth_token', credentials['auth_token']);

          // console.log(JSON.stringify(re));
          // console.log(re.status);
        },
        (err: HttpErrorResponse) => {
          console.log('error executed');
          this.login();
        }
      );

    } else {
      this.login();
    }*/





    if (this.document.location.href.startsWith('https://repurpos') && this.document.location.href.includes('oauth_verifier')) {
      this.document.location.href = 'http://localhost:4200/?' + this.document.location.href.split('?')[1];
    }
    if (this.document.location.href.includes('oauth_verifier')) {
      /*let url: string = 'http://localhost:5000/oauthcomplete?' + this.document.location.href.split('?')[1];
      console.log('entered', url);
      this.http.get(url, {
          observe: 'response',
          withCredentials: true,
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
        }

      ).subscribe((res) => {
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

        return this.http.post('http://localhost:5000/write',{
            observe: 'response',
            params: new HttpParams()
              .set('id', 'Q423111')
              .set('origin', 'http://localhost')
              .set('origin', 'https://repurpos.us')
              .set('action', 'wbeditentity')
              .set('format', 'json')
            ,
            headers: new HttpHeaders()
              .set('Authorization', this.auth_creds)
              .set('content-type', 'application/json')
              .set('charset', 'utf-8'),
          }
        ).subscribe((re) => {
            do whatever with your response
            console.log(res['error']);

            console.log(res['success']);
            let bd2 = re.body;

            console.log(JSON.stringify(re));
            console.log(re.status);
          },
          (err: HttpErrorResponse) => {
            console.log(err.error.message);
            console.log(JSON.stringify(err));
            console.log(err.status);
          }
        );

          this.http.get('https://www.wikidata.org/w/api.php', {
              params: new HttpParams()
                .set('ids', 'Q423111')
                .set('action', 'wbgetentities')
                .set('format', 'json')
                .set('origin', '*')
              ,
              headers: new HttpHeaders()
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('charset', 'utf-8'),
            }
          )
            .subscribe((res) => {
                do whatever with your response
                console.log(res);
              },
              err => {console.log(err);}
            );
      })*/

    }
  }
}
