import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { SaltWarningComponent } from '../../_dialogs/salt-warning/salt-warning.component';


@Component({
  selector: 'app-salt-warning-dialog',
  templateUrl: './salt-warning-dialog.component.html',
  styleUrls: ['./salt-warning-dialog.component.scss']
})
export class SaltWarningDialogComponent {

  constructor(public dialog: MatDialog) {}


  openDialog(): void {
    const dialogRef = this.dialog.open(SaltWarningComponent, {
      // width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
