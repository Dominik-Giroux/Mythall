import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../../../layout/dialogs/loading/loading.dialog.component';
import { AptitudeService } from '../../../../services/aptitudes/aptitude.service';
import { AptitudeItem, Aptitude } from '../../../../services/aptitudes/models/aptitude';
import { PersonnageService } from '../../../../services/personnages/personnage.service';
import { Personnage } from '../../../../services/personnages/models/personnage';
import { AlignementService } from '../../../../services/alignement.service';
import { Alignement } from '../../../../models/alignement';
import { ClasseService } from '../../../../services/classes/classe.service';
import { Classe, ClasseItem } from '../../../../services/classes/models/classe';
import { DieuService } from '../../../../services/dieu.service';
import { Dieu } from '../../../../models/dieu';
import { DonService } from '../../../../services/dons/don.service';
import { Don, DonItem } from '../../../../services/dons/models/don';
import { EspritService } from '../../../../services/esprits/esprit-service';
import { Esprit } from '../../../../services/esprits/models/esprit';
import { RaceService } from '../../../../services/races/race.service';
import { Race } from '../../../../services/races/models/race';
import { SortService } from '../../../../services/sorts/sort.service';
import { Sort, SortItem } from '../../../../services/sorts/models/sort';
import { UserService } from '../../../../services/@core/user.service';
import { User } from '../../../../services/@core/models/user';
import { Ordre } from '../../../../services/ordres/models/ordre';
import { OrdreService } from '../../../../services/ordres/ordre.service';
import { Fourberie, FourberieItem } from '../../../../services/fourberies/models/fourberie';
import { FourberieService } from '../../../../services/fourberies/fourberie.service';
import { DomaineService } from '../../../../services/domaines/domaine-service';
import { Domaine } from '../../../../services/domaines/models/domaine';
import { Subscription } from 'rxjs';

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

  private subscriptions: Subscription[] = [];

  id: string;
  personnage: Personnage = new Personnage();
  classes: Classe[];
  alignements: Alignement[];
  aptitudes: Aptitude[];
  dieux: Dieu[];
  domaines: Domaine[];
  dons: Don[];
  fourberies: Fourberie[];
  ordres: Ordre[];
  races: Race[];
  sorts: Sort[];
  users: User[];
  esprits: Esprit[];

  ngOnInit() {
    this.getPersonnage();
    this.getClasses();
    this.getAlignements();
    this.getAptitudes();
    this.getDomaines();
    this.getDons();
    this.getDieux();
    this.getEsprits();
    this.getFourberies();
    this.getOrdres();
    this.getRaces();
    this.getSorts();
    this.getUsers();
  }

  getPersonnage() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.personnageService.getPersonnage(this.id).subscribe(response => {
          this.personnage = this.personnageService.mapDefault(response);
        })
      }
    });
  }

  getClasses() {
    this.classeService.getClasses().subscribe(response => {
      this.classes = response;
    });
  }

  getAlignements() {
    this.alignementService.getAlignements().subscribe(response => {
      this.alignements = response;
    })
  }

  getAptitudes() {
    this.aptitudeService.getAptitudes().subscribe(response => {
      this.aptitudes = response;
    });
  }

  getDieux() {
    this.dieuService.getDieux().subscribe(response => {
      this.dieux = response;
    });
  }

  getDomaines() {
    this.domaineService.getDomaines().subscribe(response => {
      this.domaines = response;
    });
  }

  getDons() {
    this.donService.getDons().subscribe(response => {
      this.dons = response;
    });
  }

  getEsprits() {
    this.espritService.getEsprits().subscribe(response => {
      this.esprits = response;
    })
  }

  getFourberies() {
    this.fourberieService.getFourberies().subscribe(response => {
      this.fourberies = response;
    })
  }

  getOrdres() {
    this.ordreService.getOrdres().subscribe(response => {
      this.ordres = response;
    })
  }

  getRaces() {
    this.raceService.getRacesSummary().subscribe(response => {
      this.races = response;
    });
  }

  getSorts() {
    this.sortService.getSorts().subscribe(response => {
      this.sorts = response;
    })
  }

  getUsers() {
    this.userService.getUsers().subscribe(response => {
      this.users = response;
    });
  }

  submit() {
    this.dialog.open(LoadingDialogComponent);
    if (this.id) {
      this.personnageService.updatePersonnage(this.id, this.personnage.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/animateur/personnages/list"]);
          this.dialog.closeAll();
        }
      });
    } else {
      this.personnageService.addPersonnage(this.personnage.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/animateur/personnages/list"]);
          this.dialog.closeAll();
        }
      });
    }

  }

  addClasse() {
    this.personnage.classes.push(new ClasseItem());
  }

  deleteClasse(index: number) {
    this.personnage.classes.splice(index, 1);
  }

  addDon() {
    this.personnage.dons.push(new DonItem());
  }

  deleteDon(index: number) {
    this.personnage.dons.splice(index, 1);
  }

  addAptitude() {
    this.personnage.aptitudes.push(new AptitudeItem());
  }

  deleteAptitude(index: number) {
    this.personnage.aptitudes.splice(index, 1);
  }

  addSort() {
    this.personnage.sorts.push(new SortItem());
  }

  deleteSort(index: number) {
    this.personnage.sorts.splice(index, 1);
  }

  addFourberie() {
    this.personnage.fourberies.push(new FourberieItem());
  }

  deleteFourberie(index: number) {
    this.personnage.fourberies.splice(index, 1);
  }

}