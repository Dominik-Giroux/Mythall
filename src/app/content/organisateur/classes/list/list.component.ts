import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClasseService } from '../../../../services/classes/classe.service';
import { Classe } from '../../../../services/classes/models/classe';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-organisateur-classes-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurClassesListComponent implements OnInit {

  constructor(
    private classeService: ClasseService,
    public dialog: MatDialog
  ){}

  classes: Observable<Classe[]>;

  ngOnInit(){
    this.classes = this.classeService.getClasses();    
  }

  confirmDelete(item: Classe) {
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

  delete(classe: Classe){
    this.classeService.deleteClasse(classe);
  }

}