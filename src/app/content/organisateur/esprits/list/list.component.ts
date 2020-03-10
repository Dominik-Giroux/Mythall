import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EspritService } from '../../../../services/esprits/esprit-service';
import { Esprit } from '../../../../services/esprits/models/esprit';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-organisateur-esprits-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurEspritsListComponent implements OnInit {

  constructor(
    private espritService: EspritService,
    public dialog: MatDialog
  ){}

  esprits: Observable<Esprit[]>;

  ngOnInit(){
    this.esprits = this.espritService.getEsprits();    
  }

  confirmDelete(item: Esprit) {
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

  delete(esprit: Esprit){
    this.espritService.deleteEsprit(esprit);
  }

}