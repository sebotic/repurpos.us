import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
	forgotResponse: string;
	forgotSuccess: boolean = false;
	forgotPassForm: FormGroup;

  constructor(private http: HttpClient, @Inject(FormBuilder) fb: FormBuilder) {
  	this.forgotPassForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
  }

  /*
   * Submits the form and sends HTTP request for new password link
   */
  onSubmit(event) {
  	this.http.post(environment.api_url + '/auth/reset_pass/link',
      {"email": this.forgotPassForm.controls.email.value }, {
        observe: 'response',
        // withCredentials: true,
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let credentials = re.body;
        this.forgotResponse = credentials['message'];
        this.forgotSuccess = (credentials['status'] === 'success');
      },
      (err: HttpErrorResponse) => {
        this.forgotResponse = err.error.message;
        this.forgotSuccess = false;
      }
    )
  }

  getErrorMessage() {
    return this.forgotPassForm.controls['email'].hasError('required') ? 'You must enter a value' :
      this.forgotPassForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

}
