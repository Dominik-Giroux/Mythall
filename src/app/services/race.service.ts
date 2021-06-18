import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImmuniteService, IImmunite } from './immunite.service';
import { ResistanceService, ResistanceItem } from './resistance.service';
import { StatistiqueService, StatistiqueItem } from './statistique.service';
import { SortService, ISort } from './sort.service';
import { IDon, DonService } from './don.service';
import { ClasseService, IClasse } from './classe.service';
import { IAlignement } from './alignement.service';
import { IAptitude } from './aptitude.service';
import { IPersonnage } from './personnage.service';

export interface IRace extends IRaceDB {
  id: string;
  alignementPermis: IAlignement[];
  classesDisponible: IClasse[];
  immunites: IImmunite[];
  sortsRacial: ISort[];
  donsRacial: IDon[];
  aptitudesRacial: IAptitude[];
}

export interface IRaceDB {
  nom: string;
  description: string;
  obligations: string;
  avantages: string;
  desavantages: string;
  alignementPermisRef: string[];
  classesDisponibleRef: string[];
  ajustement: number;
  statistiques: StatistiqueItem[];
  resistances: ResistanceItem[];
  immunitesRef: string[];
  sortsRacialRef: string[];
  donsRacialRef: string[];
  aptitudesRacialRef: string[];
}

@Injectable()
export class RaceService {

  constructor(
    private afs: AngularFirestore,
    private classeService: ClasseService,
    private donService: DonService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
    private sortService: SortService
  ) { }

  public async getRaces(): Promise<IRace[]> {
    return (await this.afs.collection<IRace>('races').ref.orderBy('nom').get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IRace;
      })
      .sort((a: IRace, b: IRace) => {
        return a.nom.localeCompare(b.nom);
      })
  }

  public async getRace(id: string, full?: boolean): Promise<IRace> {
    const data = await this.afs.doc<IRace>(`races/${id}`).ref.get();
    let race = {
      id: data.id,
      ...data.data()
    } as IRace;

    if (full) {
      await Promise.all([
        this._getClasses(race),
        this._getResistances(race),
        this._getStatistiques(race),
        this._getImmunites(race),
        this._getSortsRaciaux(race),
        this._getDonsRaciaux(race)
      ]);
    }

    return race;
  }

  public async addRace(race: IRace): Promise<IRace> {
    const data = await this.afs.collection(`races`).add(this._saveState(race));
    return { id: data.id, ...race } as IRace;
  }

  public async updateRace(race: IRace): Promise<IRace> {
    await this.afs.doc<IRace>(`races/${race.id}`).update(this._saveState(race));
    return race;
  }

  public async deleteRace(id: string): Promise<boolean> {
    await this.afs.doc<IRace>(`races/${id}`).delete();
    return true;
  }

  public async getPersonnageRace(personnage: IPersonnage): Promise<IPersonnage> {
    personnage.race = await this.getRace(personnage.raceRef, true);
    return personnage;
  }

  private _saveState(item: IRace): IRaceDB {
    if (!item.resistances) item.resistances = [];
    if (!item.statistiques) item.statistiques = [];
    if (!item.immunitesRef) item.immunitesRef = [];
    if (!item.sortsRacialRef) item.sortsRacialRef = [];
    if (!item.donsRacialRef) item.donsRacialRef = [];
    if (!item.aptitudesRacialRef) item.aptitudesRacialRef = [];

    //Filter Out
    item.resistances.forEach(resistance => {
      resistance.resistance = null;
    });
    item.statistiques.forEach(statistique => {
      statistique.statistique = null;
    });

    return {
      nom: item.nom,
      description: item.description,
      obligations: item.obligations,
      avantages: item.avantages,
      desavantages: item.desavantages,
      alignementPermisRef: item.alignementPermisRef,
      classesDisponibleRef: item.classesDisponibleRef,
      ajustement: item.ajustement,
      statistiques: item.statistiques.map((obj) => { return { ...obj } }),
      resistances: item.resistances.map((obj) => { return { ...obj } }),
      immunitesRef: item.immunitesRef,
      sortsRacialRef: item.sortsRacialRef,
      donsRacialRef: item.donsRacialRef,
      aptitudesRacialRef: item.aptitudesRacialRef
    };
  }

  private async _getClasses(race: IRace): Promise<void> {
    if (race?.classesDisponibleRef?.length) {
      await Promise.all(
        race.classesDisponibleRef.map(async (classeRef) => {
          if (!race.classesDisponible) race.classesDisponible = [];
          race.classesDisponible.push(await this.classeService.getClasse(classeRef));
        })
      )
    }
  }

  private async _getResistances(race: IRace): Promise<void> {
    if (race?.resistances?.length) {
      await Promise.all(
        race.resistances.map(async (resistanceItem) => {
          resistanceItem.resistance = await this.resistanceService.getResistance(resistanceItem.resistanceRef);
        })
      )
    }
  }

  private async _getStatistiques(race: IRace): Promise<void> {
    if (race?.statistiques?.length) {
      await Promise.all(
        race.statistiques.map(async (statistiqueItem) => {
          statistiqueItem.statistique = await this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef);
        })
      )
    }
  }

  private async _getImmunites(race: IRace): Promise<void> {
    if (race?.immunitesRef?.length) {
      await Promise.all(
        race.immunitesRef.map(async (immuniteRef) => {
          if (!race.immunites) race.immunites = [];
          race.immunites.push(await this.immuniteService.getImmunite(immuniteRef));
        })
      )
    }
  }

  private async _getSortsRaciaux(race: IRace): Promise<void> {
    if (race?.sortsRacialRef?.length) {
      await Promise.all(
        race.sortsRacialRef.map(async (sortRaciauxRef) => {
          if (!race.sortsRacial) race.sortsRacial = [];
          race.sortsRacial.push(await this.sortService.getSort(sortRaciauxRef));
        })
      )
    }
  }

  private async _getDonsRaciaux(race: IRace): Promise<void> {
    if (race?.donsRacialRef?.length) {
      await Promise.all(
        race.donsRacialRef.map(async (donRaciauxRef) => {
          if (!race.donsRacial) race.donsRacial = [];
          race.donsRacial.push(await this.donService.getDon(donRaciauxRef));
        })
      )
    }
  }

}