import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'loading-dialog',
  templateUrl: './loading.dialog.component.html',
  styleUrls: ['./loading.dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadingDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

}