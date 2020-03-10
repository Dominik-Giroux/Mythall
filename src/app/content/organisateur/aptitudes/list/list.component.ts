import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort as MatSort } from '@angular/material/sort';

import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

import { AptitudeService } from '../../../../services/aptitudes/aptitude.service';
import { Aptitude } from '../../../../services/aptitudes/models/aptitude';

@Component({
  selector: 'app-organisateur-aptitudes-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurAptitudesListComponent implements OnInit {

  constructor(
    private aptitudeService: AptitudeService,
    public dialog: MatDialog
  ){}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 50;
  pageSizeOptions = [50, 100, 200];
  pageEvent: PageEvent;

  sortedData: any;
  aptitudes: Aptitude[] = [];
  filter: any = {
    nom: '',
    description: ''
  };

  ngOnInit(){
    this.getAptitudes();        
  }

  getAptitudes(){
    this.aptitudeService.getAptitudes().subscribe(response => {
      this.aptitudes = response;
      this.sortedData = this.aptitudes.slice(0, this.pageSize);
      this.length = this.aptitudes.length;
    });
  }

  confirmDelete(item: Aptitude) {
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

  delete(aptitude: Aptitude){
    this.aptitudeService.deleteAptitude(aptitude);
  }

  filterResult(aptitude: Aptitude): boolean{

    let result: boolean = true;

    if(this.filter.nom){
      if(!aptitude.nom.toLowerCase().includes(this.filter.nom.toLowerCase())){
        result = false;
      }
    }

    if(this.filter.description){
      if(!aptitude.description.toLowerCase().includes(this.filter.description.toLowerCase())){
        result = false;
      }
    }

    return result;

  }
  
  sortData(matSort: MatSort) {
    const data = this.aptitudes.slice();
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
    this.sortedData = this.aptitudes.slice(this.pageEvent.pageIndex * this.pageEvent.pageSize, (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize);
  }
  
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}