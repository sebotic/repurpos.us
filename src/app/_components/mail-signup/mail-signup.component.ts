import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { MailSignupDialogComponent } from './mail-signup-dialog/mail-signup-dialog.component';

@Injectable()
@Component({
  selector: 'app-mail-signup',
  templateUrl: './mail-signup.component.html',
  styleUrls: ['./mail-signup.component.css']
})
export class MailSignupComponent {
  showDialog = false;

  constructor(public dialog: MatDialog) { }

  dialogShow(){

    let dialogRef = this.dialog.open(MailSignupDialogComponent, {
      width: '350px',
      // height: '400px',
      data: {  },
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
