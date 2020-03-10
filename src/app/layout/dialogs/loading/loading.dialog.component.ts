import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'loading-dialog',
  templateUrl: './loading.dialog.component.html',
  styleUrls: ['./loading.dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadingDialogComponent {



  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) {
    dialogRef.disableClose = true;
  }

  hide() {
    this.dialogRef.close();
  }

}