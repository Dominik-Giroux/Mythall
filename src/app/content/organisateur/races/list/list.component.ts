import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RaceService } from '../../../../services/races/race.service';
import { Race } from '../../../../services/races/models/race';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-organisateur-races-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurRacesListComponent implements OnInit {

  constructor(
    private raceService: RaceService,
    public dialog: MatDialog
  ){}

  races: Observable<Race[]>;

  ngOnInit(){
    this.races = this.raceService.getRacesSummary();    
  }

  confirmDelete(item: Race) {
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

  delete(race: Race){
    this.raceService.deleteRace(race);
  }

}