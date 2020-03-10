import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClasseService } from '../../../../services/classes/classe.service';
import { DonService } from '../../../../services/dons/don.service';
import { ImmuniteService } from '../../../../services/immunite.service';
import { RaceService } from '../../../../services/races/race.service';
import { ResistanceService } from '../../../../services/resistance.service';
import { StatistiqueService } from '../../../../services/statistique.service';
import { Classe, ClasseAuthorise } from '../../../../services/classes/models/classe';
import { Don, DonCategories } from '../../../../services/dons/models/don';
import { Immunite } from '../../../../models/immunite';
import { Race } from '../../../../services/races/models/race';
import { Resistance, ResistanceItem } from '../../../../models/resistance';
import { Statistique, StatistiqueItem } from '../../../../models/statistique';

@Component({
  selector: 'app-organisateur-dons-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurDonsFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private classeService: ClasseService,
    private donService: DonService,
    private immuniteService: ImmuniteService,
    private raceService: RaceService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
    private router: Router
  ) { }

  id: string;
  don: Don = new Don();
  dons: Don[];
  categories: string[] = DonCategories;
  classes: Classe[];
  races: Race[];
  resistances: Resistance[];
  statistiques: Statistique[];
  immunites: Immunite[];

  ngOnInit() {
    this.getDon();
    this.getDons();
    this.getClasses();
    this.getImmunites();
    this.getRaces();
    this.getResistances();
    this.getStatistiques();
  }

  getDon() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.donService.getDon(this.id).subscribe(response => {
          this.don = response;
        });
      }
    });
  }

  getDons() {
    this.donService.getDons().subscribe(response => {
      this.dons = response;
    })
  }

  getClasses() {
    this.classeService.getClasses().subscribe(response => {
      this.classes = response;
    });
  }

  getImmunites() {
    this.immuniteService.getImmunites().subscribe(response => {
      this.immunites = response;
    })
  }

  getRaces() {
    this.raceService.getRaces().subscribe(response => {
      this.races = response;
    });
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
      this.donService.updateDon(this.id, this.don.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/dons/list"]);
        }
      });
    } else {
      this.donService.addDon(this.don.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/dons/list"]);
        }
      });
    }
  }

  addClasseAuthorise() {
    if (!this.don.classesAutorise) this.don.classesAutorise = [];
    this.don.classesAutorise.push(new ClasseAuthorise());
  }

  deleteClasseAuthorise(index: number) {
    this.don.classesAutorise.splice(index, 1);
  }

  addResistance() {
    if (!this.don.resistances) this.don.resistances = [];
    this.don.resistances.push(new ResistanceItem());
  }

  deleteResistance(index: number) {
    this.don.resistances.splice(index, 1);
  }

  addStatistique() {
    if (!this.don.statistiques) this.don.statistiques = [];
    this.don.statistiques.push(new StatistiqueItem());
  }

  deleteStatistique(index: number) {
    this.don.statistiques.splice(index, 1);
  }

  selectAllRaces() {
    this.don.racesAutoriseRef = [];
    this.races.forEach(race => {
      this.don.racesAutoriseRef.push(race.id);
    })
  }

  selectAllClasses() {
    this.don.classesAutorise = [];
    this.classes.forEach(classe => {
      const ca: ClasseAuthorise = new ClasseAuthorise();
      ca.classe = classe;
      ca.classeRef = classe.id;
      this.don.classesAutorise.push(ca);
    })
  }

}