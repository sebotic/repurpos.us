import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs/subscription';

import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from "./compound-data/compound-data.component";
import { AboutComponent } from "./about/about.component";
import { AssaysComponent } from "./assays/assays.component";
import { AssayDataComponent } from "./assay-data/assay-data.component";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { isDefined } from "@angular/compiler/src/util";
import { environment } from "../environments/environment";
import { LoginStateService } from './_services/index';
import { LoginState, RouteDef } from './_models/index';

@Injectable()
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  routeDef: RouteDef[];
  loginBox: boolean = false;
  loggedIn: boolean = false;
  current_year: number;
  private loginSubscription: Subscription;

  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient, private loginStateService: LoginStateService) {
    this.appendGaTrackingCode();

    this.current_year = (new Date()).getFullYear();
  }

  login() {
    this.http.post(environment.host_url + '/auth/login', { "email": "sebastian.burgstaller@gmail.com", "password": "test" }, {
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

  /*
   * Appends google analytics script with code from environment
   */
  private appendGaTrackingCode() {
    try {
      const script = document.createElement('script');
      script.innerHTML =
        `(function(i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function() {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', '` + environment.googleAnalyticsKey + `', 'auto');// add your tracking ID here.
        ga('send', 'pageview');`;
      document.body.appendChild(script);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
  }
}
