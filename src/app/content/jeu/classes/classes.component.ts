import { Component, OnInit } from '@angular/core';

import { ClasseService } from '../../../services/classes/classe.service';
import { Classe } from '../../../services/classes/models/classe';

@Component({
  selector: 'app-jeu-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class JeuClassesComponent implements OnInit {

  constructor(
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

  scroll(el) {
    console.log(el);
    el.scrollIntoView();
}

}
