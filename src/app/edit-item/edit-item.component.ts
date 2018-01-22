// import { Overlay, overlayConfigFactory } from 'ngx-modialog';
// import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';



import {Inject, Component, OnInit, Injectable} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";

/**
 * @title Dialog Overview
 */

@Injectable()
@Component({
  styleUrls: ['edit-item.component.scss'],
  selector: 'dialog-overview-example',
  template: `
    <div class="mat-app-background">
    <ol>
    <li>
      <mat-form-field>
        <input matInput [(ngModel)]="name" placeholder="Enter a drug class">
      </mat-form-field>
    </li>
    <li>
      <!--<button mat-raised-button (click)="openDialog()">Pick one</button>-->
      <button mat-raised-button (click)="submitData()">Submit</button>
    </li>
    <li *ngIf="animal">
      You chose: <i>{{animal}}</i>
    </li>
  </ol>
    </div>`
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

@Component({
  styleUrls: ['edit-item.component.scss'],
  selector: 'dialog-overview-example-dialog',
  template: `
    <h1 mat-dialog-title>Hi {{data.name}}</h1>
  <div mat-dialog-content>
    <p>What's your favorite animal?</p>
    <mat-form-field>
      <input matInput tabindex="1" [(ngModel)]="data.animal">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="data.animal" tabindex="2">Ok</button>
    <button mat-button (click)="onNoClick()" tabindex="-1">No Thanks</button>
  </div>`,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  // template: '<dialog-overview-example></dialog-overview-example>',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  showDialog:boolean = false ;

  constructor() {  }

  ngOnInit() {
  }

  dialog(){
    if (this.showDialog) {
      this.showDialog = false;
    }
    else {
      this.showDialog = true;
    }

  }

}
