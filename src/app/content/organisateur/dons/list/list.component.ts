import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort as MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';

import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

import { DonService } from '../../../../services/dons/don.service';
import { Don } from '../../../../services/dons/models/don';

@Component({
  selector: 'app-organisateur-dons-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurDonsListComponent implements OnInit {

  constructor(
    private donService: DonService,
    public dialog: MatDialog
  ){}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 50;
  pageSizeOptions = [50, 100, 200];
  pageEvent: PageEvent;

  sortedData: any;
  dons: Don[] = [];
  filter: any = {
    nom: '',
    description: ''
  };

  ngOnInit(){
    this.getDons();        
  }

  getDons(){
    this.donService.getDons().subscribe(response => {
      this.dons = response;
      this.sortedData = this.dons.slice(0, this.pageSize);
      this.length = this.dons.length;
    });
  }

  confirmDelete(item: Don) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delete(result);
      }
    });
  }

  delete(don: Don){
    this.donService.deleteDon(don);
  }

  filterResult(don: Don): boolean{

    let result: boolean = true;

    if(this.filter.nom){
      if(!don.nom.toLowerCase().includes(this.filter.nom.toLowerCase())){
        result = false;
      }
    }

    if(this.filter.description){
      if(!don.description.toLowerCase().includes(this.filter.description.toLowerCase())){
        result = false;
      }
    }

    return result;

  }
  
  sortData(matSort: MatSort) {
    const data = this.dons.slice();
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

  setPageEvent(event: PageEvent){
    this.pageEvent = event;
    this.sortedData = this.dons.slice(this.pageEvent.pageIndex * this.pageEvent.pageSize, (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize);
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}