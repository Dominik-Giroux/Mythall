import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

import { PersonnageService } from '../../../../services/personnages/personnage.service';
import { Personnage } from '../../../../services/personnages/models/personnage';

@Component({
  selector: 'app-animateur-personnages-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AnimateurPersonnagesListComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    public dialog: MatDialog
  ){}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 1000;
  pageSizeOptions = [1000, 10000];
  pageEvent: PageEvent;

  sortedData: any;
  personnages: Personnage[] = [];
  filter: any = {
    nom: '',
    joueur: '',
    race: '',
    classe: ''
  };

  ngOnInit(){
    this.personnageService.getPersonnages().subscribe(response => {
      this.personnages = new Array();
      for(var i = 0; i < response.length; i++){
        var personnage: Personnage = new Personnage();
        personnage = this.personnageService.mapDefault(response[i]);
        //personnage.classes.forEach(classe => {
          // if(classe.classeRef == 'MtoDhZxdwjRK3SB8MfzV'){
            this.personnages.push(personnage);
          //}
        //})
        
      }
      this.sortedData = this.personnages.slice(0, this.pageSize);
      this.length = this.personnages.length;
    });
  }

  confirmDelete(item: Personnage) {
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

  delete(personnage: Personnage){
    this.personnageService.deletePersonnage(personnage);
  }

  filterResult(personnage: Personnage): boolean{

    let result: boolean = true;

    if(this.filter.nom){
      if(!personnage.nom.toLowerCase().includes(this.filter.nom.toLowerCase())){
        result = false;
      }
    }

    if(this.filter.joueur){
      if(!personnage.user.displayname.toLowerCase().includes(this.filter.joueur.toLowerCase())){
        result = false;
      }
    }

    if(this.filter.race){
      if(!personnage.race.nom.toLowerCase().includes(this.filter.race.toLowerCase())){
        result = false;
      }
    }

    return result;

  }
  
  sortData(sort: Sort) {
    const data = this.personnages.slice();
    if (!sort.active || sort.direction == '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'nom': return compare(a.nom, b.nom, isAsc);
        case 'joueur': return compare(a.user.displayname, b.user.displayname, isAsc);
        case 'race': return compare(a.race.nom, b.race.nom, isAsc);
        default: return 0;
      }
    });
  }

  setPageEvent(event: PageEvent){
    this.pageEvent = event;
    this.sortedData = this.personnages.slice(this.pageEvent.pageIndex * this.pageEvent.pageSize, (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize);
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}