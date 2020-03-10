import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrdreService } from '../../../../services/ordres/ordre.service';
import { Ordre } from '../../../../services/ordres/models/ordre';
import { ClasseService } from '../../../../services/classes/classe.service';
import { Classe } from '../../../../services/classes/models/classe';
import { Alignement } from '../../../../models/alignement';
import { AlignementService } from '../../../../services/alignement.service';

@Component({
  selector: 'app-organisateur-ordres-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurOrdresFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private ordreService: OrdreService,
    private alignementService: AlignementService,
    private classeService: ClasseService,
    private router: Router
  ){}

  id: string;
  ordre: Ordre = new Ordre();
  classes: Classe[];
  alignements: Alignement[];

  ngOnInit() {
    this.getOrdre();
    this.getClasses();
    this.getAlignements();
  }

  getOrdre() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']){
        this.id = params['id'];
        this.ordreService.getOrdre(this.id).subscribe(response => {
          this.ordre = this.ordreService.map(response);
        });
      }
    });
  }

  getClasses() {
    this.classeService.getClasses().subscribe(response => {
      this.classes = response;
    })
  }

  getAlignements() {
    this.alignementService.getAlignements().subscribe(response => {
      this.alignements = response;
    })
  }

  submit() {
    if(this.id){
      this.ordreService.updateOrdre(this.id, this.ordre.saveState()).then(result => {
        if(result){
          this.router.navigate(["/organisateur/ordres/list"]);
        }
      });
    } else {
      this.ordreService.addOrdre(this.ordre.saveState()).then(result => {
        if(result){
          this.router.navigate(["/organisateur/ordres/list"]);
        }
      });
    }    
  }

}