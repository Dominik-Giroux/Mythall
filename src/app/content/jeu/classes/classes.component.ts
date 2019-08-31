import { Component, OnInit } from '@angular/core';

import { ClasseService } from '../../../services/classes/classe.service';
import { Classe } from '../../../services/classes/models/classe';
import { MatDialog } from '@angular/material';
import { JeuClasseDetailsDialogComponent } from './details/details.dialog.component';

@Component({
  selector: 'app-jeu-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class JeuClassesComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private classeService: ClasseService
  ){}

  classes: Classe[];
  multiClasses: Classe[];

  ngOnInit(){

    // Get Full Classes List for Multiclassement
    this.classeService.getClasses().subscribe(response => {
      this.multiClasses = response;
    })

    // Get Classes
    this.classeService.getClassesStandard().subscribe(response => {
      this.classes = response;
    });

  }

  displayDetails(id) {
    let dialogRef = this.dialog.open(JeuClasseDetailsDialogComponent, {
      width: 'auto',
      data: id
    });
  }

  scroll(el) {
    console.log(el);
    el.scrollIntoView();
}

}
