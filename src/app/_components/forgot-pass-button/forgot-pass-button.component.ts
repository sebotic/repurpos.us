import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ForgotPasswordComponent } from '../../_dialogs/index';

@Component({
  selector: 'app-forgot-pass-button',
  templateUrl: './forgot-pass-button.component.html',
  styleUrls: ['./forgot-pass-button.component.scss']
})
export class ForgotPassButtonComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  dialogShow() {
  	let dialogRef = this.dialog.open(ForgotPasswordComponent, {
  		data: {}
  	});

  	dialogRef.afterClosed().subscribe(result => {
      console.log('The forgot password dialog was closed');
    });
  }

}
