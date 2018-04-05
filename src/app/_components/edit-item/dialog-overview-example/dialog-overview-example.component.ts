import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { DialogOverviewExampleDialog } from '../dialog-overview-example-dialog/dialog-overview-example-dialog.component';

@Injectable()
@Component({
  selector: 'dialog-overview-example',
  templateUrl: './dialog-overview-example.component.html',
  styleUrls: ['./dialog-overview-example.component.css']
})
export class DialogOverviewExample {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog, private http: HttpClient) {}

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  submitData(): void {
    this.http.post('http://localhost:5000/write', {
        'id': this.name,

      }, {
        observe: 'response',
        withCredentials: true,
        params: new HttpParams()
          .set('origin', 'https://repurpos.us')
          .set('action', 'wbeditentity')
          .set('format', 'json')
        ,

        headers: new HttpHeaders()
          // .set('Authorization', this.auth_creds)
          .set('content-type', 'application/json')
          .set('charset', 'utf-8'),
      }

    ).subscribe((re) => {
        console.log(JSON.stringify(re));
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      }
    );
  }

}