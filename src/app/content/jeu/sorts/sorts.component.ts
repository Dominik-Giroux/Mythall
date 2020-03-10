import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JeuSortDetailsDialogComponent } from './details/details.dialog.component';
import { SortService } from '../../../services/sorts/sort.service';
import { Sort } from '../../../services/sorts/models/sort';



@Component({
  selector: 'app-jeu-sorts',
  templateUrl: './sorts.component.html',
  styleUrls: ['./sorts.component.scss']
})
export class JeuSortsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private sortService: SortService
  ) { }

  sorts: Sort[];

  ngOnInit() {

    // Get Sorts
    this.sortService.getSorts().subscribe(response => {
      this.sorts = response;
    });

  }

  scroll(el) {
    console.log(el);
    el.scrollIntoView();
  }

  displayDetails(id) {
    let dialogRef = this.dialog.open(JeuSortDetailsDialogComponent, {
      width: 'auto',
      data: id
    });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

}
