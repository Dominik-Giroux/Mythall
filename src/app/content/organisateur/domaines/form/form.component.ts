import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AptitudeService, IAptitude, AptitudeItem } from '../../../../services/aptitude.service';
import { DonService, IDon, DonCategories, DonItem } from '../../../../services/don.service';
import { DomaineService, IDomaine } from '../../../../services/domaine.service';
import { SortService, ISort, SortItem } from '../../../../services/sort.service';
import { ClasseService, IClasse } from '../../../../services/classe.service';
import { IAlignement, AlignementService } from '../../../../services/alignement.service';
import { FourberieService, IFourberie } from '../../../../services/fourberie.service';
import { ChoixTypes, Choix } from '../../../../services/choix.service';

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
  domaine = {} as IDomaine;
  domaines: IDomaine[];
  classes: IClasse[];
  alignements: IAlignement[];
  aptitudes: IAptitude[];
  dons: IDon[];
  sorts: ISort[];
  fourberies: IFourberie[];
  choix: string[] = ChoixTypes;
  categories: string[] = DonCategories;

  ngOnInit() {
    this._getDomaine();
    this._getDomaines();
    this._getAptitudes();
    this._getClasses();
    this._getAlignements();
    this._getDons();
    this._getSorts();
    this._getFourberies();
  }

  private _getDomaine(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.domaine = await this.domaineService.getDomaine(this.id);
      }
    });
  }

  private async _getDomaines(): Promise<void> {
    this.domaines = await this.domaineService.getDomaines();
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

  public async submit(): Promise<void> {
    if (this.id) {
      const result = await this.domaineService.updateDomaine(this.domaine);
      if (result) {
        this.router.navigate(["/organisateur/domaines/list"]);
      }
    } else {
      const result = await this.domaineService.addDomaine(this.domaine);
      if (result) {
        this.router.navigate(["/organisateur/domaines/list"]);
      }
    }
  }

  public addAptitude(): void {
    if (!this.domaine.aptitudes) this.domaine.aptitudes = [];
    this.domaine.aptitudes.push(new AptitudeItem());
  }

  public deleteAptitude(index: number): void {
    this.domaine.aptitudes.splice(index, 1);
  }

  public addDon(): void {
    if (!this.domaine.dons) this.domaine.dons = [];
    this.domaine.dons.push(new DonItem());
  }

  public deleteDon(index: number): void {
    this.domaine.dons.splice(index, 1);
  }

  public addSort(): void {
    if (!this.domaine.sorts) this.domaine.sorts = [];
    this.domaine.sorts.push(new SortItem());
  }

  public deleteSort(index: number): void {
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