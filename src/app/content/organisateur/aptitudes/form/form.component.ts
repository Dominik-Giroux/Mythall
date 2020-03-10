import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClasseService } from '../../../../services/classes/classe.service';
import { AptitudeService } from '../../../../services/aptitudes/aptitude.service';
import { DonService } from '../../../../services/dons/don.service';
import { ImmuniteService } from '../../../../services/immunite.service';
import { RaceService } from '../../../../services/races/race.service';
import { ResistanceService } from '../../../../services/resistance.service';
import { StatistiqueService } from '../../../../services/statistique.service';
import { Aptitude } from '../../../../services/aptitudes/models/aptitude';
import { Classe } from '../../../../services/classes/models/classe';
import { Don, DonCategories } from '../../../../services/dons/models/don';
import { Immunite } from '../../../../models/immunite';
import { Race } from '../../../../services/races/models/race';
import { Resistance, ResistanceItem } from '../../../../models/resistance';
import { Statistique, StatistiqueItem } from '../../../../models/statistique';
import { SortService } from '../../../../services/sorts/sort.service';
import { Sort } from '../../../../services/sorts/models/sort';
import { Choix, ChoixTypes } from '../../../../services/personnages/models/choix';

@Component({
  selector: 'app-organisateur-aptitudes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurAptitudesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private donService: DonService,
    private aptitudeService: AptitudeService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private sortService: SortService,
    private statistiqueService: StatistiqueService,
    private router: Router
  ) { }

  id: string;
  aptitude: Aptitude = new Aptitude();
  aptitudes: Aptitude[];
  classes: Classe[];
  dons: Don[];
  sorts: Sort[];
  races: Race[];
  resistances: Resistance[];
  statistiques: Statistique[];
  immunites: Immunite[];
  choix: string[] = ChoixTypes;
  categories: string[] = DonCategories;

  ngOnInit() {
    this.getAptitude();
    this.getAptitudes();
    this.getDons();
    this.getSorts();
    this.getImmunites();
    this.getResistances();
    this.getStatistiques();
  }

  getAptitude() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.aptitudeService.getAptitude(this.id).subscribe(response => {
          this.aptitude = response;
        });
      }
    });
  }

  getAptitudes() {
    this.aptitudeService.getAptitudes().subscribe(response => {
      this.aptitudes = response;
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

  getImmunites() {
    this.immuniteService.getImmunites().subscribe(response => {
      this.immunites = response;
    })
  }

  getResistances() {
    this.resistanceService.getResistances().subscribe(response => {
      this.resistances = response;
    });
  }

  getStatistiques() {
    this.statistiqueService.getStatistiques().subscribe(response => {
      this.statistiques = response;
    })
  }

  submit() {
    if (this.id) {
      this.aptitudeService.updateAptitude(this.id, this.aptitude.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/aptitudes/list"]);
        }
      });
    } else {
      this.aptitudeService.addAptitude(this.aptitude.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/aptitudes/list"]);
        }
      });
    }
  }

  addResistance() {
    if (!this.aptitude.resistances) this.aptitude.resistances = [];
    this.aptitude.resistances.push(new ResistanceItem());
  }

  deleteResistance(index: number) {
    this.aptitude.resistances.splice(index, 1);
  }

  addStatistique() {
    if (!this.aptitude.statistiques) this.aptitude.statistiques = [];
    this.aptitude.statistiques.push(new StatistiqueItem());
  }

  deleteStatistique(index: number) {
    this.aptitude.statistiques.splice(index, 1);
  }

  addChoix() {
    if (!this.aptitude.choix) this.aptitude.choix = [];
    this.aptitude.choix.push(new Choix());
  }

  deleteChoix(index: number) {
    this.aptitude.choix.splice(index, 1);
  }

}