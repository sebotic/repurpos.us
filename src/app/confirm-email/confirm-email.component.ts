import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
	cid: string;
	confirmResponse: string;
	confirmFail: boolean = false;
	confirmForm: FormGroup;

  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject(FormBuilder) fb: FormBuilder) {
  	route.params.subscribe(params => {
  		this.cid = params['cid'];
  	});

  	this.confirmForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
  	this.http.post(environment.host_url + '/auth/confirm',
  		{"token": this.cid},
  		{
  			observe: 'response',
  			headers: new HttpHeaders()
  				.set('content-type', 'application/json')
  		}
  	).subscribe(res => {
  		this.confirmResponse = res.body['message'];
  		if (res.body['status'] == 'fail') this.confirmFail = true;
  		else this.confirmFail = false;
  	},
  	(err: HttpErrorResponse) => {
  		console.log(err);
  		this.confirmResponse = err.error.message;
  		if (err.status != 501) this.confirmFail = true;
  	})
  }

  onSubmit(event) {
  	this.http.post(environment.host_url + '/auth/confirm/link',
      {"email": this.confirmForm.controls.email.value }, {
        observe: 'response',
        // withCredentials: true,
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let credentials = re.body;
        if (credentials['status'] === 'success') {
          //console.log(credentials['auth_token']);
          //localStorage.setItem('auth_token', credentials['auth_token']);

          this.confirmResponse = credentials['message'];
          //location.reload();
          // console.log(re.status);

        } else if (credentials['status'] === 'fail') {
          this.confirmResponse = credentials['message'];
        }
      },
      (err: HttpErrorResponse) => {
        this.confirmResponse = err.error.message;
      }
    )
  }

  getErrorMessage() {
    return this.confirmForm.controls['email'].hasError('required') ? 'You must enter a value' :
      this.confirmForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

}
