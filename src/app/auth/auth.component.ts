import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { DOCUMENT } from '@angular/common';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';


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


@Injectable()
@Component({
  selector: 'auth-button',
  template: `
    <div *ngIf="authenticated; else lgin"><button type="submit" (click)="logout()" class="btn btn-danger">Logout</button></div> 
    <ng-template #lgin><button type="submit" (click)="login()" class="btn btn-success">Authenticate</button></ng-template>
    
  `,
})
export class AuthGuard implements CanActivate, OnInit {
  authenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  login(): void {
    this.authService.login('dd', 'ade');
  }

  ngOnInit(){
    this.authService.loggedIn().subscribe((res) => {
      console.log(res.body);
      if (res.body['uid'] !== '') {
        this.authenticated = true;
        console.log('authenticated');

      } else {
        console.log('not authenticated');
        this.authenticated = false;
      }
    });
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      console.log(res.body);
      if (res.body['success'] !== '') {
        this.authenticated = false;
        console.log('logged out');

      } else {
        console.log('still authenticated');
        this.authenticated = true;
      }
    },
      err => {
        console.log(err);
        this.authenticated = false;
      }

    );
  }
}


@Injectable()
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

}
