import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  constructor (
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {}

  login(username, password): any {

    // maybe enable user and pwd login, needs post request...
    const body = {
      username,
      password
    };
    return this.http.get('http://localhost:5000/oauth', {withCredentials: true}).subscribe((res) => {

      this.redirectUrl = res['oauth_redir'];
      console.log(this.redirectUrl);
      this.document.location.href = this.redirectUrl;

      // this code will currently not be reached, as there needs to be a redirect to WD OAuth
      this.isLoggedIn = true;
      if (this.redirectUrl) {
        this.router.navigate([this.redirectUrl]);
        this.redirectUrl = null;
      }
    })
  }

  loggedIn(): any{

    return this.http.get('http://localhost:5000/authenticated', {
      observe: 'response',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }

  logout(): any {
    return this.http.get('http://localhost:5000/logout', {
      observe: 'response',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });

    // this.isLoggedIn = false;
  }
}
