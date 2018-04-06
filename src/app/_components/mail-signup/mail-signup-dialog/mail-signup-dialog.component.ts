import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'mail-signup-dialog',
  templateUrl: './mail-signup-dialog.component.html',
  styleUrls: ['./mail-signup-dialog.component.css']
})
export class MailSignupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MailSignupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
