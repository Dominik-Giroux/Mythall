import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClasseService, IClasse, ClasseTypes, ClasseSort } from '../../../../services/classe.service';
import { IAlignement, AlignementService } from '../../../../services/alignement.service';
import { FourberieService, IFourberie } from '../../../../services/fourberie.service';
import { AptitudeService, IAptitude, AptitudeItem } from '../../../../services/aptitude.service';
import { DonService, IDon, DonCategories, DonItem } from '../../../../services/don.service';
import { SortService, ISort, SortItem } from '../../../../services/sort.service';
import { ImmuniteService, IImmunite } from '../../../../services/immunite.service';
import { ResistanceService, IResistance, ResistanceItem } from '../../../../services/resistance.service';
import { StatistiqueService, IStatistique, StatistiqueItem } from '../../../../services/statistique.service';
import { ChoixTypes, Choix } from '../../../../services/choix.service';

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
  classe = {} as IClasse;
  classes: IClasse[];
  alignements: IAlignement[];
  aptitudes: IAptitude[];
  dons: IDon[];
  sorts: ISort[];
  fourberies: IFourberie[];
  choix: string[] = ChoixTypes;
  categories: string[] = DonCategories;
  resistances: IResistance[];
  statistiques: IStatistique[];
  immunites: IImmunite[];
  classeTypes: string[] = ClasseTypes;
  classeSorts: string[] = ClasseSort;

  ngOnInit() {
    this._getClasse();
    this._getClasses()
    this._getAptitudes();
    this._getAlignements();
    this._getDons();
    this._getSorts();
    this._getFourberies();
    this._getResistances();
    this._getStatistiques();
    this._getImmunites();
  }

  private _getClasse(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.classe = await this.classeService.getClasse(this.id);
      }
    });
  }

  private async _getClasses(): Promise<void> {
    this.classes = await this.classeService.getClasses();
  }

  private async _getAlignements(): Promise<void> {
    this.alignements = await this.alignementService.getAlignements();
  }

  private async _getAptitudes(): Promise<void> {
    this.aptitudes = await this.aptitudeService.getAptitudes();
  }

  private async _getFourberies(): Promise<void> {
    this.fourberies = await this.fourberieService.getFourberies();
  }

  private async _getDons(): Promise<void> {
    this.dons = await this.donService.getDons();
  }

  private async _getSorts(): Promise<void> {
    this.sorts = await this.sortService.getSorts();
  }

  private async _getResistances(): Promise<void> {
    this.resistances = await this.resistanceService.getResistances();
  }

  private async _getStatistiques(): Promise<void> {
    this.statistiques = await this.statistiqueService.getStatistiques();
  }

  private async _getImmunites(): Promise<void> {
    this.immunites = await this.immuniteService.getImmunites();
  }

  public async submit(): Promise<void> {
    if (this.id) {
      const result = await this.classeService.updateClasse(this.classe);
      if (result) {
        this.router.navigate(["/organisateur/classes/list"]);
      }
    } else {
      const result = await this.classeService.addClasse(this.classe);
      if (result) {
        this.router.navigate(["/organisateur/classes/list"]);
      }
    }
  }

  public addAptitude(): void {
    if (!this.classe.aptitudes) this.classe.aptitudes = [];
    this.classe.aptitudes.push(new AptitudeItem());
  }

  public deleteAptitude(index: number): void {
    this.classe.aptitudes.splice(index, 1);
  }

  public addDon(): void {
    if (!this.classe.dons) this.classe.dons = [];
    this.classe.dons.push(new DonItem());
  }

  public deleteDon(index: number): void {
    this.classe.dons.splice(index, 1);
  }

  public addSort(): void {
    if (!this.classe.sorts) this.classe.sorts = [];
    this.classe.sorts.push(new SortItem());
  }

  public deleteSort(index: number): void {
    this.classe.sorts.splice(index, 1);
  }

  public addSortDisponible(): void {
    if (!this.classe.sortsDisponible) this.classe.sortsDisponible = [];
    this.classe.sortsDisponible.push(new SortItem());
  }

  public deleteSortDisponible(index: number): void {
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

  public addResistance(): void {
    if (!this.classe.resistances) this.classe.resistances = [];
    this.classe.resistances.push(new ResistanceItem());
  }

  public deleteResistance(index: number): void {
    this.classe.resistances.splice(index, 1);
  }

  public addStatistique(): void {
    if (!this.classe.statistiques) this.classe.statistiques = [];
    this.classe.statistiques.push(new StatistiqueItem());
  }

  public deleteStatistique(index: number): void {
    this.classe.statistiques.splice(index, 1);
  }

}