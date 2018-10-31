import { Component, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../_services/index';

@Injectable()
@Component({
  selector: 'auth-button',
  template: `
    <div *ngIf="authenticated; else lgin"><button type="submit" (click)="logout()" class="btn btn-danger" aria-label="logout">Logout</button></div>
    <ng-template #lgin><button type="submit" (click)="login()" class="btn btn-success" aria-label="authenticate">Authenticate</button></ng-template>

  `,
})
export class AuthGuard implements CanActivate {
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
