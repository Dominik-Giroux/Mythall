import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AptitudeService, IAptitude } from '../../../../services/aptitude.service';
import { DonService, IDon, DonCategories } from '../../../../services/don.service';
import { ImmuniteService, IImmunite } from '../../../../services/immunite.service';
import { ResistanceService, IResistance, ResistanceItem } from '../../../../services/resistance.service';
import { StatistiqueService, IStatistique, StatistiqueItem } from '../../../../services/statistique.service';
import { SortService, ISort } from '../../../../services/sort.service';
import { IClasse } from '../../../../services/classe.service';
import { IRace } from '../../../../services/race.service';
import { ChoixTypes, Choix } from '../../../../services/choix.service';

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
  aptitude = {} as IAptitude;
  aptitudes: IAptitude[];
  classes: IClasse[];
  dons: IDon[];
  sorts: ISort[];
  races: IRace[];
  resistances: IResistance[];
  statistiques: IStatistique[];
  immunites: IImmunite[];
  choix = ChoixTypes;
  categories = DonCategories;

  ngOnInit() {
    this._getAptitude();
    this._getAptitudes();
    this._getDons();
    this._getSorts();
    this._getImmunites();
    this._getResistances();
    this._getStatistiques();
  }

  private _getAptitude(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.aptitude = await this.aptitudeService.getAptitude(this.id);
      }
    });
  }

  private async _getAptitudes(): Promise<void> {
    this.aptitudes = await this.aptitudeService.getAptitudes();
  }

  private async _getDons(): Promise<void> {
    this.dons =  await this.donService.getDons();
  }

  private async _getSorts(): Promise<void> {
    this.sorts = await this.sortService.getSorts();
  }

  private async _getImmunites(): Promise<void> {
    this.immunites = await this.immuniteService.getImmunites();
  }

  private async _getResistances(): Promise<void> {
    this.resistances = await this.resistanceService.getResistances();
  }

  private async _getStatistiques(): Promise<void> {
    this.statistiques = await this.statistiqueService.getStatistiques();
  }

  public async submit(): Promise<void> {
    if (this.id) {
      const result = await this.aptitudeService.updateAptitude(this.aptitude);
      if (result) {
        this.router.navigate(["/organisateur/aptitudes/list"]);
      }
    } else {
      const result = await this.aptitudeService.addAptitude(this.aptitude);
      if (result) {
        this.router.navigate(["/organisateur/aptitudes/list"]);
      }
    }
  }

  public addResistance(): void {
    if (!this.aptitude.resistances) this.aptitude.resistances = [];
    this.aptitude.resistances.push(new ResistanceItem());
  }

  public deleteResistance(index: number): void {
    this.aptitude.resistances.splice(index, 1);
  }

  public addStatistique(): void {
    if (!this.aptitude.statistiques) this.aptitude.statistiques = [];
    this.aptitude.statistiques.push(new StatistiqueItem());
  }

  public deleteStatistique(index: number): void {
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