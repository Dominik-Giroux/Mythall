import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ClasseService } from '../../../../services/classes/classe.service';
import { Classe, ClasseTypes, ClasseSort } from '../../../../services/classes/models/classe';
import { AptitudeItem, Aptitude } from '../../../../services/aptitudes/models/aptitude';
import { Don, DonItem, DonCategories } from '../../../../services/dons/models/don';
import { Sort, SortItem } from '../../../../services/sorts/models/sort';
import { Alignement } from '../../../../models/alignement';
import { AlignementService } from '../../../../services/alignement.service';
import { ChoixTypes, Choix } from '../../../../services/personnages/models/choix';
import { Fourberie } from '../../../../services/fourberies/models/fourberie';
import { FourberieService } from '../../../../services/fourberies/fourberie.service';
import { AptitudeService } from '../../../../services/aptitudes/aptitude.service';
import { DonService } from '../../../../services/dons/don.service';
import { SortService } from '../../../../services/sorts/sort.service';
import { ImmuniteService } from '../../../../services/immunite.service';
import { ResistanceService } from '../../../../services/resistance.service';
import { StatistiqueService } from '../../../../services/statistique.service';
import { Resistance, ResistanceItem } from '../../../../models/resistance';
import { Statistique, StatistiqueItem } from '../../../../models/statistique';
import { Immunite } from '../../../../models/immunite';

@Component({
  selector: 'app-organisateur-classes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurClassesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private classeService: ClasseService,
    private aptitudeService: AptitudeService,
    private alignementService: AlignementService,
    private donService: DonService,
    private fourberieService: FourberieService,
    private sortService: SortService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
    private router: Router
  ) { }

  id: string;
  classe: Classe = new Classe();
  classes: Observable<Classe[]>;
  alignements: Alignement[];
  aptitudes: Aptitude[];
  dons: Don[];
  sorts: Sort[];
  fourberies: Fourberie[];
  choix: string[] = ChoixTypes;
  categories: string[] = DonCategories;
  resistances: Resistance[];
  statistiques: Statistique[];
  immunites: Immunite[];
  classeTypes: string[] = ClasseTypes;
  classeSorts: string[] = ClasseSort;

  ngOnInit() {
    this.getClasse();
    this.getClasses()
    this.getaptitudes();
    this.getAlignements();
    this.getDons();
    this.getSorts();
    this.getFourberies();
    this.getResistances();
    this.getStatistiques();
    this.getImmunites();
  }

  getClasse() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.classeService.getClasse(this.id).subscribe(response => {
          this.classe = this.classeService.map(response);
        });
      }
    });
  }

  getClasses() {
    this.classes = this.classeService.getClasses();
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

  getResistances() {
    this.resistanceService.getResistances().subscribe(response => {
      this.resistances = response;
    });
  }

  getStatistiques(){
    this.statistiqueService.getStatistiques().subscribe(response => {
      this.statistiques = response;
    })
  }

  getImmunites(){
    this.immuniteService.getImmunites().subscribe(response => {
      this.immunites = response;
    })
  }

  submit() {
    if (this.id) {
      this.classeService.updateClasse(this.id, this.classe.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/classes/list"]);
        }
      });
    } else {
      this.classeService.addClasse(this.classe.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/classes/list"]);
        }
      });
    }
  }

  addAptitude() {
    if (!this.classe.aptitudes) this.classe.aptitudes = [];
    this.classe.aptitudes.push(new AptitudeItem());
  }

  deleteAptitude(index: number) {
    this.classe.aptitudes.splice(index, 1);
  }

  addDon() {
    if (!this.classe.dons) this.classe.dons = [];
    this.classe.dons.push(new DonItem());
  }

  deleteDon(index: number) {
    this.classe.dons.splice(index, 1);
  }

  addSort() {
    if (!this.classe.sorts) this.classe.sorts = [];
    this.classe.sorts.push(new SortItem());
  }

  deleteSort(index: number) {
    this.classe.sorts.splice(index, 1);
  }

  addSortDisponible() {
    if (!this.classe.sortsDisponible) this.classe.sortsDisponible = [];
    this.classe.sortsDisponible.push(new SortItem());
  }

  deleteSortDisponible(index: number) {
    this.classe.sortsDisponible.splice(index, 1);
  }


  addChoix() {
    if (!this.classe.choix) this.classe.choix = [];
    const choix = new Choix();
    this.classe.choix.push(choix);
  }

  deleteChoix(index: number) {
    this.classe.choix.splice(index, 1);
  }

  changeChoix(index: number) {
    delete this.classe.choix[index].ref;
    delete this.classe.choix[index].categorie;
  }

  addResistance(){
    if(!this.classe.resistances) this.classe.resistances = [];
    this.classe.resistances.push(new ResistanceItem());
  }

  deleteResistance(index: number){
    this.classe.resistances.splice(index, 1);
  }

  addStatistique(){
    if(!this.classe.statistiques) this.classe.statistiques = [];
    this.classe.statistiques.push(new StatistiqueItem());
  }

  deleteStatistique(index: number){
    this.classe.statistiques.splice(index, 1);
  }

}