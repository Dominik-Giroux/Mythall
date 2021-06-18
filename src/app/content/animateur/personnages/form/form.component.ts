import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../../../layout/dialogs/loading/loading.dialog.component';
import { AptitudeService, IAptitude, AptitudeItem } from '../../../../services/aptitude.service';
import { PersonnageService, IPersonnage } from '../../../../services/personnage.service';
import { IAlignement, AlignementService } from '../../../../services/alignement.service';
import { ClasseService, IClasse, ClasseItem } from '../../../../services/classe.service';
import { IDieu, DieuService } from '../../../../services/dieu.service';
import { DonService, IDon, DonItem } from '../../../../services/don.service';
import { EspritService, IEsprit } from '../../../../services/esprit.service';
import { RaceService, IRace } from '../../../../services/race.service';
import { SortService, ISort, SortItem } from '../../../../services/sort.service';
import { UserService, IUser } from '../../../../services/user.service';
import { OrdreService, IOrdre } from '../../../../services/ordre.service';
import { FourberieService, IFourberie, FourberieItem } from '../../../../services/fourberie.service';
import { DomaineService, IDomaine } from '../../../../services/domaine.service';

@Component({
  selector: 'app-animateur-personnages-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AnimateurPersonnagesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private alignementService: AlignementService,
    private aptitudeService: AptitudeService,
    private classeService: ClasseService,
    private dieuService: DieuService,
    private domaineService: DomaineService,
    private donService: DonService,
    private espritService: EspritService,
    private fourberieService: FourberieService,
    private ordreService: OrdreService,
    private personnageService: PersonnageService,
    private raceService: RaceService,
    private sortService: SortService,
    private userService: UserService,
    private router: Router,
  ) { }

  id: string;
  personnage = {} as IPersonnage;
  classes: IClasse[];
  alignements: IAlignement[];
  aptitudes: IAptitude[];
  dieux: IDieu[];
  domaines: IDomaine[];
  dons: IDon[];
  fourberies: IFourberie[];
  ordres: IOrdre[];
  races: IRace[];
  sorts: ISort[];
  users: IUser[];
  esprits: IEsprit[];

  ngOnInit() {
    this._getPersonnage();
    this._getClasses();
    this._getAlignements();
    this._getAptitudes();
    this._getDomaines();
    this._getDons();
    this._getDieux();
    this._getEsprits();
    this._getFourberies();
    this._getOrdres();
    this._getRaces();
    this._getSorts();
    this._getUsers();
  }

  private _getPersonnage(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.personnage = await this.personnageService.getPersonnage(this.id);
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

  private async _getDieux(): Promise<void> {
    this.dieux = await this.dieuService.getDieux();
  }

  private async _getDomaines(): Promise<void> {
    this.domaines = await this.domaineService.getDomaines();
  }

  private async _getDons(): Promise<void> {
    this.dons = await this.donService.getDons();
  }

  private async _getEsprits(): Promise<void> {
    this.esprits = await this.espritService.getEsprits();
  }

  private async _getFourberies(): Promise<void> {
    this.fourberies = await this.fourberieService.getFourberies();
  }

  private async _getOrdres(): Promise<void> {
    this.ordres = await this.ordreService.getOrdres();
  }

  private async _getRaces(): Promise<void> {
    this.races = await this.raceService.getRaces();
  }

  private async _getSorts(): Promise<void> {
    this.sorts = await this.sortService.getSorts();
  }

  private async _getUsers(): Promise<void> {
    this.users = await this.userService.getUsers();
  }

  public async submit(): Promise<void> {
    this.dialog.open(LoadingDialogComponent);
    if (this.id) {
      const result = await this.personnageService.updatePersonnage(this.personnage);
      if (result) {
        this.router.navigate(["/animateur/personnages/list"]);
        this.dialog.closeAll();
      }
    } else {
      const result = await this.personnageService.addPersonnage(this.personnage);
      if (result) {
        this.router.navigate(["/animateur/personnages/list"]);
        this.dialog.closeAll();
      }
    }

  }

  public addClasse(): void {
    this.personnage.classes.push(new ClasseItem());
  }

  public deleteClasse(index: number): void {
    this.personnage.classes.splice(index, 1);
  }

  public addDon(): void {
    this.personnage.dons.push(new DonItem());
  }

  public deleteDon(index: number): void {
    this.personnage.dons.splice(index, 1);
  }

  public addAptitude(): void {
    this.personnage.aptitudes.push(new AptitudeItem());
  }

  public deleteAptitude(index: number): void {
    this.personnage.aptitudes.splice(index, 1);
  }

  public addSort(): void {
    this.personnage.sorts.push(new SortItem());
  }

  public deleteSort(index: number): void {
    this.personnage.sorts.splice(index, 1);
  }

  public addFourberie(): void {
    this.personnage.fourberies.push(new FourberieItem());
  }

  public deleteFourberie(index: number): void {
    this.personnage.fourberies.splice(index, 1);
  }

}