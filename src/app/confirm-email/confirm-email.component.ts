import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
	cid: string;
	confirmResponse: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  	route.params.subscribe(params => {
  		this.cid = params['cid'];
  	})
  }

  ngOnInit() {
  	console.log(this.cid);
  	console.log(environment.host_url + '/auth/confirm' + this.cid);
  	this.http.post(environment.host_url + '/auth/confirm',
  		{"token": this.cid},
  		{
  			observe: 'response',
  			headers: new HttpHeaders()
  				.set('content-type', 'application/json')
  		}
  	).subscribe(res => {
  		this.confirmResponse = res.body['message'];
  	})
  }

}
