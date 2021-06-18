import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImmuniteService, IImmunite } from './immunite.service';
import { ResistanceService, ResistanceItem } from './resistance.service';
import { StatistiqueService, StatistiqueItem } from './statistique.service';
import { IDon } from './don.service';
import { IPersonnage } from './personnage.service';
import { Choix } from './choix.service';

export interface IAptitude extends IAptitudeDB {
  id: string;
  donsEquivalent: IDon[];
  sortsEquivalent: IDon[];
  immunites: IImmunite[];
}

export interface IAptitudeDB {
  nom: string;
  description: string;
  donsEquivalentRef: string[];
  sortsEquivalentRef: string[];
  immunitesRef: string[];
  resistances: ResistanceItem[];
  statistiques: StatistiqueItem[];
  choix: Choix[];
}

export class AptitudeItem {
  constructor() {
    this.aptitude = null;
    this.aptitudeRef = '';
    this.niveauObtention = 1;
  }

  aptitude: IAptitude;
  aptitudeRef: string;
  niveauObtention: number;
}

@Injectable()
export class AptitudeService {

  constructor(
    private afs: AngularFirestore,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
  ) { }

  public async getAptitudes(): Promise<IAptitude[]> {
    return (await this.afs.collection<IAptitude>('aptitudes').ref.orderBy('nom').get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IAptitude;
      })
      .sort((a: IAptitude, b: IAptitude) => {
        return a.nom.localeCompare(b.nom);
      })
  }

  public async getAptitude(id: string): Promise<IAptitude> {
    const data = await this.afs.doc<IAptitude>(`aptitudes/${id}`).ref.get();
    let aptitude = {
      id: data.id,
      ...data.data()
    } as IAptitude;

    await Promise.all([
      this._getImmunites(aptitude),
      this._getResistances(aptitude),
      this._getStatistiques(aptitude)
    ]);

    return aptitude;
  }

  public async addAptitude(aptitude: IAptitude): Promise<IAptitude> {
    const data = await this.afs.collection(`aptitudes`).add(this._saveState(aptitude));
    return { id: data.id, ...aptitude } as IAptitude;
  }

  public async updateAptitude(aptitude: IAptitude): Promise<IAptitude> {
    await this.afs.doc<IAptitude>(`aptitudes/${aptitude.id}`).update(this._saveState(aptitude));
    return aptitude;
  }

  public async deleteAptitude(id: string): Promise<boolean> {
    await this.afs.doc<IAptitude>(`aptitudes/${id}`).delete();
    return true;
  }

  public async getPersonnageAptitudes(personnage: IPersonnage): Promise<IPersonnage> {

    if (!personnage.aptitudes) personnage.aptitudes = [];

    // Aptitudes Racial
    if (personnage?.race?.aptitudesRacialRef?.length) {
      personnage.race.aptitudesRacialRef.forEach(aptitudeRef => {
        let aptitudeItem = new AptitudeItem();
        aptitudeItem.aptitudeRef = aptitudeRef;
        personnage.aptitudes.push(aptitudeItem);
      })
    };

    // Aptitudes Classes
    if (personnage?.classes?.length) {
      personnage.classes.forEach(classeItem => {
        if (classeItem.classe.aptitudes && classeItem.classe.aptitudes.length > 0) {
          classeItem.classe.aptitudes.forEach(aptitudeItem => {
            if (classeItem.niveau >= aptitudeItem.niveauObtention) {
              if (!personnage.aptitudes) personnage.aptitudes = [];
              personnage.aptitudes.push(aptitudeItem);
            }
          })
        }
      });
    }

    // Aptitudes Domaines
    if (personnage?.domaines?.length) {
      personnage.domaines.forEach(domaine => {
        if (domaine.aptitudes && domaine.aptitudes.length > 0) {
          domaine.aptitudes.forEach(aptitudeItem => {
            personnage.classes.forEach(classe => {
              if (classe.classeRef == 'fNqknNgq0QmHzUaYEvEd' && classe.niveau >= aptitudeItem.niveauObtention) {
                personnage.aptitudes.push(aptitudeItem);
              }
            })
          })
        }
      });
    }

    // Aptitudes Esprit
    if (personnage?.esprit?.aptitudes?.length > 0) {
      personnage.esprit.aptitudes.forEach(aptitudeItem => {
        personnage.classes.forEach(classe => {
          if (classe.classeRef == 'wW48swrqmr77awfyADMX' && classe.niveau >= aptitudeItem.niveauObtention) {
            personnage.aptitudes.push(aptitudeItem);
          }
        })
      })
    };

    // Remplis la liste de aptitudes complète
    if (personnage?.aptitudes?.length) {
      await Promise.all(
        personnage.aptitudes.map(async (aptitudeItem) => {
          aptitudeItem.aptitude = await this.getAptitude(aptitudeItem.aptitudeRef);
        })
      );
    }

    // Filter Duplicates
    personnage.aptitudes = personnage.aptitudes.filter((aptitude, index, self) =>
      index === self.findIndex((d) => (
        d.aptitudeRef === aptitude.aptitudeRef
      ))
    )

    return personnage;
  }

  private _saveState(item: IAptitude): IAptitudeDB {

    if (!item.donsEquivalentRef) item.donsEquivalentRef = [];
    if (!item.sortsEquivalentRef) item.sortsEquivalentRef = [];
    if (!item.immunitesRef) item.immunitesRef = [];
    if (!item.resistances) item.resistances = [];
    if (!item.statistiques) item.statistiques = [];
    if (!item.choix) item.choix = [];

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
      donsEquivalentRef: item.donsEquivalentRef,
      sortsEquivalentRef: item.sortsEquivalentRef,
      immunitesRef: item.immunitesRef,
      resistances: item.resistances.map((obj) => { return { ...obj } }),
      statistiques: item.statistiques.map((obj) => { return { ...obj } }),
      choix: item.choix.map((obj) => { return { ...obj } }),
    };
  }

  private async _getImmunites(aptitude: IAptitude): Promise<void> {
    if (aptitude?.immunitesRef?.length) {
      await Promise.all(
        aptitude.immunitesRef.map(async (immuniteRef) => {
          if (!aptitude.immunites) aptitude.immunites = [];
          aptitude.immunites.push(await this.immuniteService.getImmunite(immuniteRef));
        })
      )
    }
  }

  private async _getResistances(aptitude: IAptitude): Promise<void> {
    if (aptitude?.resistances?.length) {
      await Promise.all(
        aptitude.resistances.map(async (resistanceItem: ResistanceItem) => {
          resistanceItem.resistance = await this.resistanceService.getResistance(resistanceItem.resistanceRef);
        })
      )
    }
  }

  private async _getStatistiques(aptitude: IAptitude): Promise<void> {
    if (aptitude?.statistiques?.length) {
      await Promise.all(
        aptitude.statistiques.map(async (statistiqueItem) => {
          statistiqueItem.statistique = await this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef);
        })
      );
    }
  }
}