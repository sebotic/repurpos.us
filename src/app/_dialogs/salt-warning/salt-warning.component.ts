import { Component } from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-salt-warning',
  templateUrl: './salt-warning.component.html',
  styleUrls: ['./salt-warning.component.scss']
})
export class SaltWarningComponent {

  constructor(private dialogRef: MatDialogRef<SaltWarningComponent>) { }

  close() {
    this.dialogRef.close();
}

}
