import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../layout/dialogs/loading/loading.dialog.component';
import { AptitudeService, AptitudeItem } from './aptitude.service';
import { ClasseService, ClasseItem } from './classe.service';
import { DonService, DonItem } from './don.service';
import { RaceService, IRace } from './race.service';
import { UserService, IUser } from './user.service';
import { StatistiqueService, StatistiqueValue } from './statistique.service';
import { DomaineService, IDomaine } from './domaine.service';
import { IDieu, DieuService } from './dieu.service';
import { IAlignement, AlignementService } from './alignement.service';
import { EspritService, IEsprit } from './esprit.service';
import { SortService, SortItem } from './sort.service';
import { OrdreService, IOrdre } from './ordre.service';
import { FourberieService, FourberieItem } from './fourberie.service';
import { EcoleService, IEcole } from './ecole.service';
import { ResistanceValue, ResistanceService } from './resistance.service';
import { IImmunite, ImmuniteService } from './immunite.service';

export interface IPersonnage extends IPersonnageDB {
  id: string;
  user: IUser;
  alignement: IAlignement;
  race: IRace;
  statistiques: StatistiqueValue[];
  capaciteSpeciales: StatistiqueValue[]; //Display Only, not saved
  resistances: ResistanceValue[];
  immunites: IImmunite[];
  esprit: IEsprit;
  ecole: IEcole;
  dieu: IDieu;
  ordres: IOrdre[];
  domaines: IDomaine[];
  niveauEffectif: number;
  niveauReel: number;
  niveauProfane: number;
  niveauDivin: number;
  niveauDisponible: number;
}

export interface IPersonnageDB {
  nom: string;
  userRef: string;
  classes: ClasseItem[];
  alignementRef: string;
  dons: DonItem[];
  aptitudes: AptitudeItem[];
  sorts: SortItem[];
  fourberies: FourberieItem[];
  raceRef: string;
  gnEffectif: number;
  espritRef: string;
  ecoleRef: string;
  dieuRef: string;
  ordresRef: string[];
  domainesRef: string[];
  vie: number;
}

@Injectable()
export class PersonnageService {

  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private alignementService: AlignementService,
    private aptitudeService: AptitudeService,
    private classeService: ClasseService,
    private domaineService: DomaineService,
    private donService: DonService,
    private dieuService: DieuService,
    private ecoleService: EcoleService,
    private espritService: EspritService,
    private fourberieService: FourberieService,
    private immuniteServices: ImmuniteService,
    private ordreService: OrdreService,
    private raceService: RaceService,
    private resistanceService: ResistanceService,
    private sortService: SortService,
    private statistiqueService: StatistiqueService,
    private userService: UserService
  ) { }

  public async getPersonnages(userId?: string): Promise<IPersonnage[]> {
    let query = this.afs.collection<IPersonnage>('personnages').ref.orderBy('createdAt');
    if (userId) {
      query = query.where('userRef', '==', userId);
    }
    return (await query.get()).docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as IPersonnage;
    });
  }

  public async getPersonnage(id: string): Promise<IPersonnage> {
    const data = await this.afs.doc<IPersonnage>(`personnages/${id}`).ref.get();
    return {
      id: data.id,
      ...data.data()
    } as IPersonnage;
  }

  public async addPersonnage(personnage: IPersonnage): Promise<IPersonnage> {
    const data = await this.afs.collection(`personnages`).add(this._saveState(personnage));
    return { id: data.id, ...personnage } as IPersonnage;
  }

  public async updatePersonnage(personnage: IPersonnage): Promise<IPersonnage> {
    await this.afs.doc<IPersonnage>(`personnages/${personnage.id}`).update(this._saveState(personnage));
    return personnage;
  }

  public async deletePersonnage(id: string): Promise<boolean> {
    await this.afs.doc<IPersonnage>(`personnages/${id}`).delete();
    return true;
  }

  private _saveState(item: IPersonnage): IPersonnageDB {
    if (!item.dieuRef) item.dieuRef = '';
    if (!item.ecoleRef) item.ecoleRef = '';
    if (!item.espritRef) item.espritRef = '';
    if (!item.ordresRef) item.ordresRef = [];
    if (!item.domainesRef) item.domainesRef = [];

    // Filter Out Race Dons / Sorts / Fourberies / Aptitudes
    if (item.race) {

      // Race
      if (item.dons && item.dons.length > 0) {
        let donsTemporaire: DonItem[] = [];
        item.dons.forEach(don => {
          let found: boolean = false;
          item.race.donsRacialRef.forEach(id => {
            if (id == don.donRef) {
              found = true;
            }
          });

          if (!found) {
            donsTemporaire.push(don);
          }

        });
        item.dons = donsTemporaire;
      }

      // Sorts
      if (item.sorts && item.sorts.length > 0) {
        let sortsTemporaire: SortItem[] = [];
        item.sorts.forEach(sort => {
          let found: boolean = false;
          item.race.sortsRacialRef.forEach(id => {
            if (id == sort.sortRef) {
              found = true;
            }
          });

          if (!found) {
            sortsTemporaire.push(sort);
          }

        });
        item.sorts = sortsTemporaire;
      }

      // Aptitudes
      if (item.aptitudes && item.aptitudes.length > 0) {
        let aptitudesTemporaire: AptitudeItem[] = [];
        item.aptitudes.forEach(aptitude => {
          let found: boolean = false;
          item.race.aptitudesRacialRef.forEach(id => {
            if (id == aptitude.aptitudeRef) {
              found = true;
            }
          });

          if (!found) {
            aptitudesTemporaire.push(aptitude);
          }

        });
        item.aptitudes = aptitudesTemporaire;
      }

    }

    //Filter Out Populated Objects
    item.classes.forEach(classeItem => {
      classeItem.classe = null;
    });
    item.dons.forEach(donItem => {
      donItem.don = null;
    });
    item.aptitudes.forEach(aptitudeItem => {
      aptitudeItem.aptitude = null;
    });
    item.sorts.forEach(sortItem => {
      sortItem.sort = null;
    });
    item.fourberies.forEach(fourberieItem => {
      fourberieItem.fourberie = null;
    });

    return {
      nom: item.nom,
      classes: item.classes.map((obj) => { return { ...obj } }),
      alignementRef: item.alignementRef,
      dons: item.dons.map((obj) => { return { ...obj } }),
      aptitudes: item.aptitudes.map((obj) => { return { ...obj } }),
      sorts: item.sorts.map((obj) => { return { ...obj } }),
      fourberies: item.fourberies.map((obj) => { return { ...obj } }),
      raceRef: item.raceRef,
      userRef: item.userRef,
      ecoleRef: item.ecoleRef,
      espritRef: item.espritRef,
      dieuRef: item.dieuRef,
      ordresRef: item.ordresRef,
      domainesRef: item.domainesRef,
      vie: item.vie,
      gnEffectif: item.gnEffectif,
    }
  }

  public async buildPersonnage(personnage: IPersonnage): Promise<IPersonnage> {

    try {

      this._showLoading(`Personnage`);
      await Promise.all([
        this.userService.getPersonnageUser(personnage),
        this.raceService.getPersonnageRace(personnage),
        this.classeService.getPersonnageClasses(personnage),
        this.alignementService.getPersonnageAlignement(personnage),
        this.dieuService.getPersonnageDieu(personnage),
        this.ordreService.getPersonnageOrdres(personnage),
        this.fourberieService.getPersonnageFourberies(personnage)
      ]);

      this._showLoading(`Niveau Effectif`);
      await this._getPersonnageNiveauEffectif(personnage);

      this._showLoading('Domaines & Esprits');
      await Promise.all([
        this.domaineService.getPersonnageDomaines(personnage),
        this.espritService.getPersonnageEsprit(personnage)
      ]);

      this._showLoading('Aptitudes');
      await this.aptitudeService.getPersonnageAptitudes(personnage);

      this._showLoading('Sorts & Dons');
      await Promise.all([
        this.sortService.getPersonnageSorts(personnage),
        this.donService.getPersonnageDons(personnage)
      ]);

      this._showLoading('Statistiques de base');
      await this.statistiqueService.getPersonnageStatistiquesParDefault(personnage);

      this._showLoading('Statistiques, Resistances & Immunities');
      await Promise.all([
        this.statistiqueService.getPersonnageStatistiques(personnage),
        this.resistanceService.getPersonnageResistances(personnage),
        this.immuniteServices.getPersonnageImmunites(personnage)
      ]);

      this._showLoading('Niveau de dons & Capacité spéciales');
      await Promise.all([
        this.donService.getPersonnageDonsNiveauEffectif(personnage),
        this.statistiqueService.getPersonnageCapaciteSpeciales(personnage)
      ]);

      console.log("Personnage Build Completed");
      console.log(personnage);

      // Completed
      this.dialog.closeAll();

      // Resolving
      return personnage;
    } catch (error) {
      console.log(error);
      // ...
      // Mettre une dialog d'erreur ici pour indiquer au joueur que sa fiche n'as pas loadé
    }

  }

  private async _getPersonnageNiveauEffectif(personnage: IPersonnage): Promise<IPersonnage> {

    personnage.niveauEffectif = 0;
    personnage.niveauReel = 0;
    personnage.niveauProfane = 0;
    personnage.niveauDivin = 0;

    if (personnage.classes) {

      personnage.classes.forEach(classe => {
        personnage.niveauEffectif += classe.niveau;
        personnage.niveauReel += classe.niveau;

        if (classe.classe.sort == 'Profane') {
          personnage.niveauProfane += classe.niveau;
        }

        if (classe.classe.sort == 'Divin') {
          personnage.niveauDivin += classe.niveau;
        }

      });

    }

    if (personnage.race) {
      if (personnage.race.ajustement) {
        personnage.niveauEffectif += +personnage.race.ajustement;
        personnage.niveauProfane += +personnage.race.ajustement;
        personnage.niveauDivin += +personnage.race.ajustement;
      }
    }

    return personnage;
  }

  private _showLoading(data?: string) {
    console.log(`Building  ${data}...`);
    this.dialog.closeAll();
    this.dialog.open(LoadingDialogComponent, { data: `Loading ${data}...` });
  }

}