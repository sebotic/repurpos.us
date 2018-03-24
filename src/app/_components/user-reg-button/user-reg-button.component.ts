import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";

import { TermsComponent, UserRegistrationComponent } from '../../_dialogs/index';

@Component({
  selector: 'app-reg-user-dialog',
  templateUrl: './user-reg-button.component.html',
  styleUrls: ['./user-reg-button.component.css']
})
export class UserRegButtonComponent implements OnInit {
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
