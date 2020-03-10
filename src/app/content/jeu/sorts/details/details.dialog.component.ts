import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SortService } from '../../../../services/sorts/sort.service';
import { Sort } from '../../../../services/sorts/models/sort';

@Component({
  selector: 'jeu-sort-details-dialog',
  templateUrl: './details.dialog.component.html',
  styleUrls: ['./details.dialog.component.scss']
})
export class JeuSortDetailsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JeuSortDetailsDialogComponent>,
    private sortService: SortService,
    @Inject(MAT_DIALOG_DATA) public id: string
  ) { }

  public sort: Sort;

  ngOnInit(){
    this.sortService.getSort(this.id).subscribe(sort => {
      this.sort = sort;
      console.log(sort);
    })
  }

}