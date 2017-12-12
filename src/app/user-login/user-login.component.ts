import { Component, OnInit } from '@angular/core';
import {User} from "../user-registration/user-registration.component";
import {HttpErrorResponse, HttpHeaders, HttpClient} from "@angular/common/http";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  user: User = new User(0,'','', '', '', '', '', '', '', '');
  loggedIn: boolean = false;

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private http: HttpClient) { }

  ngOnInit() {

    if(localStorage.getItem('auth_token')){
      this.http.get('http://localhost:5000/auth/status', {
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

          console.log(JSON.stringify(re));
          // console.log(re.status);
        },
        (err: HttpErrorResponse) => {
          console.log('error executed');
          this.loggedIn = false;
        }
      );

    } else {
      this.loggedIn = false;
    }
  }

  onSubmit(event){
    console.log(this.user.email, this.user.password);

    this.http.post('http://localhost:5000/auth/login', {"email": this.user.email, "password": this.user.password}, {
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
        location.reload();
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      }
    );

  }

  logout(){
    this.http.post('http://localhost:5000/auth/logout', {}, {
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
