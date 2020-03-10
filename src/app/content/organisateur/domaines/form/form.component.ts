import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AptitudeService } from '../../../../services/aptitudes/aptitude.service';
import { DonService } from '../../../../services/dons/don.service';
import { DomaineService } from '../../../../services/domaines/domaine-service';
import { SortService } from '../../../../services/sorts/sort.service';

import { AptitudeItem, Aptitude } from '../../../../services/aptitudes/models/aptitude';
import { Don, DonItem, DonCategories } from '../../../../services/dons/models/don';
import { Domaine } from '../../../../services/domaines/models/domaine';
import { Sort, SortItem } from '../../../../services/sorts/models/sort';
import { ClasseService } from '../../../../services/classes/classe.service';
import { Classe } from '../../../../services/classes/models/classe';
import { Alignement } from '../../../../models/alignement';
import { AlignementService } from '../../../../services/alignement.service';
import { ChoixTypes, Choix } from '../../../../services/personnages/models/choix';
import { Fourberie } from '../../../../services/fourberies/models/fourberie';
import { FourberieService } from '../../../../services/fourberies/fourberie.service';

@Component({
  selector: 'app-organisateur-domaines-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurDomainesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private aptitudeService: AptitudeService,
    private alignementService: AlignementService,
    private classeService: ClasseService,
    private donService: DonService,
    private domaineService: DomaineService,
    private fourberieService: FourberieService,
    private sortService: SortService,
    private router: Router
  ) { }

  id: string;
  domaine: Domaine = new Domaine();
  domaines: Domaine[];
  classes: Classe[];
  alignements: Alignement[];
  aptitudes: Aptitude[];
  dons: Don[];
  sorts: Sort[];
  fourberies: Fourberie[];
  choix: string[] = ChoixTypes;
  categories: string[] = DonCategories;

  ngOnInit() {
    this.getDomaine();
    this.getDomaines();
    this.getaptitudes();
    this.getClasses();
    this.getAlignements();
    this.getDons();
    this.getSorts();
    this.getFourberies();
  }

  getDomaine() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.domaineService.getDomaine(this.id).subscribe(response => {
          this.domaine = response;
        });
      }
    });
  }

  getDomaines() {
    this.domaineService.getDomaines().subscribe(response => {
      this.domaines = response;
    })
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

  getaptitudes() {
    this.aptitudeService.getAptitudes().subscribe(response => {
      this.aptitudes = response;
    })
  }

  getFourberies() {
    this.fourberieService.getFourberies().subscribe(response => {
      this.fourberies = response;
    })
  }

  getDons() {
    this.donService.getDons().subscribe(response => {
      this.dons = response;
    })
  }

  getSorts() {
    this.sortService.getSorts().subscribe(response => {
      this.sorts = response;
    })
  }

  submit() {
    if (this.id) {
      this.domaineService.updateDomaine(this.id, this.domaine.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/domaines/list"]);
        }
      });
    } else {
      this.domaineService.addDomaine(this.domaine.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/domaines/list"]);
        }
      });
    }
  }

  addAptitude() {
    if (!this.domaine.aptitudes) this.domaine.aptitudes = [];
    this.domaine.aptitudes.push(new AptitudeItem());
  }

  deleteAptitude(index: number) {
    this.domaine.aptitudes.splice(index, 1);
  }

  addDon() {
    if (!this.domaine.dons) this.domaine.dons = [];
    this.domaine.dons.push(new DonItem());
  }

  deleteDon(index: number) {
    this.domaine.dons.splice(index, 1);
  }

  addSort() {
    if (!this.domaine.sorts) this.domaine.sorts = [];
    this.domaine.sorts.push(new SortItem());
  }

  deleteSort(index: number) {
    this.domaine.sorts.splice(index, 1);
  }

  addChoix() {
    if (!this.domaine.choix) this.domaine.choix = [];
    const choix = new Choix();
    choix.domaine = true;
    this.domaine.choix.push(choix);
  }

  deleteChoix(index: number) {
    this.domaine.choix.splice(index, 1);
  }

  changeChoix(index: number) {
    delete this.domaine.choix[index].ref;
    delete this.domaine.choix[index].categorie;
  }

}