import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder, AbstractControl} from '@angular/forms';
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material";
import {isNullOrUndefined} from "util";

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    let confirmPassword = AC.get('confirmPassword').value;
    if(password != confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true});
    } else {
      AC.get('confirmPassword').setErrors( null);
      return null
    }
  }
}


export class User {

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public institution: string,
    public position: string,
    public address: string,
    public zipCode: string,
    public city: string,
    public email: string,
    public password: string,
    public confirmPassword?: string,
    public phone?: string

  ) {  }

}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  user = new User(0, '', '', '', '', '', '', '', '','', '');
  form: FormGroup;
  recaptchaToken: string;

  constructor(private http: HttpClient, @Inject(FormBuilder) fb: FormBuilder) {
    this.form = fb.group({
      name: fb.group({
        firstName: [this.user.firstName, Validators.minLength(2)],
        lastName: this.user.lastName,
      }),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      password: fb.group({
        password: [this.user.password, Validators.minLength(8)],
        confirmPassword: [this.user.confirmPassword, Validators.minLength(8)],
      }, {validator: PasswordValidation.MatchPassword}),
    });

  }

  ngOnInit() {}

  onSubmit(event){
    console.log(this.user.email, this.user.lastName);

    this.http.post('http://localhost:5000/auth/register',
      {"email": this.user.email, "password": this.user.password, "recaptcha_token": this.recaptchaToken}, {
        observe: 'response',
        // withCredentials: true,
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let credentials = re.body;
        if (credentials['status'] === 'success') {
          console.log(credentials['auth_token']);
          localStorage.setItem('auth_token', credentials['auth_token']);

          console.log(JSON.stringify(re));
          location.reload();
          // console.log(re.status);

        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      }
    );
  }

  getErrorMessage() {
    return this.form.controls['email'].hasError('required') ? 'You must enter a value' :
      this.form.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.recaptchaToken = captchaResponse;
  }

}

@Component({
  selector: 'app-reg-user-dialog',
  template: `<button (click)="dialogShow()" class="btn btn-xs">Create Account ...</button>`,
  styleUrls: ['./user-registration.component.css']
})
export class UserRegComponent implements OnInit {
  showDialog:boolean = false;

  constructor(public dialog: MatDialog) {  }

  ngOnInit() {
  }

  dialogShow() {

    let dialogRef = this.dialog.open(UserRegistrationComponent, {
      // width: '450px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });

    if (this.showDialog) {
      this.showDialog = false;
    }
    else {
      this.showDialog = true;
    }
  }
}
