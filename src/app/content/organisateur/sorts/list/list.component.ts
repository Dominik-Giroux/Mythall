import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort as MatSort } from '@angular/material/sort';

import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

import { EcoleService } from '../../../../services/ecole.service';
import { SortService } from '../../../../services/sorts/sort.service';
import { Sort } from '../../../../services/sorts/models/sort';
import { Ecole } from '../../../../models/ecole';

@Component({
  selector: 'app-organisateur-sorts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurSortsListComponent implements OnInit {

  constructor(
    private ecoleService: EcoleService,
    private sortService: SortService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 50;
  pageSizeOptions = [50, 100, 200];
  pageEvent: PageEvent;

  sortedData: any;
  sorts: Sort[] = [];
  filter: any = {
    nom: '',
    niveau: '',
    sommaire: ''
  };

  ecoles: Ecole[] = [];

  ngOnInit() {
    this.getEcoles();
    this.getSorts();
  }

  getSorts() {
    this.sortService.getSorts().subscribe(response => {
      this.sorts = new Array();
      for (var i = 0; i < response.length; i++) {
        var sort: Sort = new Sort();
        sort = this.sortService.mapSummary(response[i]);
        this.sorts.push(sort);
      }
      this.sortedData = this.sorts.slice(0, this.pageSize);
      this.length = this.sorts.length;
    });
  }

  getEcoles() {
    this.ecoleService.getEcoles().subscribe(response => {
      for (var i = 0; i < response.length; i++) {
        this.ecoles.push(response[i]);
      }
    })
  }

  confirmDelete(item: Sort) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(result);
      }
    });
  }

  delete(sort: Sort) {
    this.sortService.deleteSort(sort);
  }

  filterResult(sort: Sort): boolean {

    let result: boolean = true;

    if (this.filter.nom) {
      if (!sort.nom.toLowerCase().includes(this.filter.nom.toLowerCase())) {
        result = false;
      }
    }

    if (this.filter.niveau) {
      if (!sort.niveau.toLowerCase().includes(this.filter.niveau.toLowerCase())) {
        result = false;
      }
    }

    if (this.filter.ecole) {
      if (!sort.ecole.id.includes(this.filter.ecole)) {
        result = false;
      }
    }

    return result;

  }

  sortData(matSort: MatSort) {
    const data = this.sorts.slice();
    if (!matSort.active || matSort.direction == '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      let isAsc = matSort.direction == 'asc';
      switch (matSort.active) {
        case 'nom': return compare(a.nom, b.nom, isAsc);
        default: return 0;
      }
    });
  }

  setPageEvent(event: PageEvent) {
    this.pageEvent = event;
    this.sortedData = this.sorts.slice(this.pageEvent.pageIndex * this.pageEvent.pageSize, (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize);
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}