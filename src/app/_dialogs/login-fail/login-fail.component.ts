import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-login-fail',
  templateUrl: './login-fail.component.html',
  styleUrls: ['./login-fail.component.scss']
})
export class LoginFailComponent implements OnInit {
	errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
  	this.errorMessage = this.data.error ? this.data.error : 'Login failed. Please try again...';
  }

}
	