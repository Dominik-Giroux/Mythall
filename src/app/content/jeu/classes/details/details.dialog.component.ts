import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClasseService } from '../../../../services/classes/classe.service';
import { Classe } from '../../../../services/classes/models/classe';

@Component({
  selector: 'jeu-classe-details-dialog',
  templateUrl: './details.dialog.component.html',
  styleUrls: ['./details.dialog.component.scss']
})
export class JeuClasseDetailsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JeuClasseDetailsDialogComponent>,
    private classeService: ClasseService,
    @Inject(MAT_DIALOG_DATA) public id: string
  ) { }

  public classe: Classe;

  ngOnInit(){
    this.classeService.getClasse(this.id).subscribe(classe => {
      this.classe = classe;
      console.log(classe);
    })
  }

}