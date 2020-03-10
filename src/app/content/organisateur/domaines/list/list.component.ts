import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DomaineService } from '../../../../services/domaines/domaine-service';
import { Domaine } from '../../../../services/domaines/models/domaine';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-organisateur-domaines-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurDomainesListComponent implements OnInit {

  constructor(
    private domaineService: DomaineService,
    public dialog: MatDialog
  ){}

  domaines: Observable<Domaine[]>;

  ngOnInit(){
    this.domaines = this.domaineService.getDomaines();    
  }

  confirmDelete(item: Domaine) {
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

  delete(domaine: Domaine){
    this.domaineService.deleteDomaine(domaine);
  }

}