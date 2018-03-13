import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse, HttpHeaders, HttpClient} from "@angular/common/http";
import {FormControl, Validators} from "@angular/forms";
import { MatDialog } from '@angular/material';
import {environment} from "../../environments/environment";

import { User } from "../_models/user";
import { LoginFailComponent } from '../_dialogs/index';
import { LoginStateService } from '../_services/index';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  user: User = new User(0,'','', '', '', '', '', '', '', '');
  loggedIn: boolean = false;

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private http: HttpClient, private loginStateService: LoginStateService, public dialog: MatDialog) { }

  ngOnInit() {

    if(localStorage.getItem('auth_token')){
      this.http.get(environment.host_url + '/auth/status', {
          observe: 'response',
          // withCredentials: true,
          headers: new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Authorization', localStorage.getItem('auth_token'))
        }

      ).subscribe((re) => {
          let userInfo = re.body;

          // maybe do some checks here for the user, but not really important if the token came back valid

          this.loggedIn = true;
          this.loginStateService.loggedIn();

          // console.log(JSON.stringify(re));
          // console.log(re.status);
        },
        (err: HttpErrorResponse) => {
          console.log('error executed');
          this.loggedIn = false;
          this.loginStateService.loggedOut();
        }
      );

    } else {
      this.loggedIn = false;
      this.loginStateService.loggedOut();
    }
  }

  onSubmit(event){
    console.log(this.user.email, this.user.password);

    this.http.post(environment.host_url + '/auth/login', {"email": this.user.email, "password": this.user.password}, {
        observe: 'response',
        // withCredentials: true,
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let credentials = re.body;
        console.log(credentials['auth_token']);
        localStorage.setItem('auth_token', credentials['auth_token']);

        console.log(JSON.stringify(re));
        // console.log(re.status);
        this.loggedIn = true;
        this.loginStateService.loggedIn();
        location.reload();
      },
      (err: HttpErrorResponse) => {
        this.dialog.open(LoginFailComponent);
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      }
    );

  }

  logout(){
    this.http.post(environment.host_url +  '/auth/logout', {}, {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Authorization', localStorage.getItem('auth_token'))
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let logoutReply = re.body;

        if(logoutReply['status'] === 'success') {
          localStorage.removeItem('auth_token');
          this.loggedIn = false;
          this.loginStateService.loggedOut();
          location.reload();
        }


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

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
