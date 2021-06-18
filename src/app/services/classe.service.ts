import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AptitudeService, AptitudeItem } from './aptitude.service';
import { SortService, SortItem } from './sort.service';
import { ImmuniteService, IImmunite } from './immunite.service';
import { ResistanceService, ResistanceItem } from './resistance.service';
import { StatistiqueService, StatistiqueItem } from './statistique.service';
import { DonItem, DonService } from './don.service';
import { IAlignement } from './alignement.service';
import { IPersonnage } from './personnage.service';
import { Choix } from './choix.service';

export interface IClasse extends IClasseDB {
  id: string;
  alignementPermis: IAlignement[];
  multiclassement: IClasse[];
  immunites: IImmunite[];
}

export interface IClasseDB {
  nom: string;
  description: string;
  obligations: string;
  avantages: string;
  desavantages: string;
  alignementPermisRef: string[];
  multiclassementRef: string[];
  aptitudes: AptitudeItem[];
  dons: DonItem[];
  sorts: SortItem[];
  sortsDisponible: SortItem[];
  choix: Choix[];
  statistiques: StatistiqueItem[];
  resistances: ResistanceItem[];
  immunitesRef: string[];
  type: string;
  sort: string;
  prestige: boolean;
}

export const ClasseTypes = ['Combatant', 'Lanceur de Sort'];
export const ClasseSort = ['Divin', 'Profane'];

export class ClasseItem {
  constructor() {
    this.classe = null;
    this.classeRef = '';
    this.niveau = 1;
  }

  classe: IClasse;
  classeRef: string;
  niveau: number;
}

export class ClasseAuthorise {
  constructor() {
    this.classe = null;
    this.classeRef = '';
    this.niveau = 1;
  }

  classe: IClasse;
  classeRef: string;
  niveau: number;
}

@Injectable()
export class ClasseService {

  constructor(
    private afs: AngularFirestore,
    private aptitudeService: AptitudeService,
    private donService: DonService,
    private sortService: SortService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
  ) { }

  public async getClasses(onlyBase?: boolean, onlyPrestige?: boolean): Promise<IClasse[]> {
    let query = this.afs.collection<IClasse>('classes').ref.orderBy('nom');

    if (onlyBase) {
      query = query.where('prestige', '==', false);
    }

    if (onlyPrestige) {
      query = query.where('prestige', '==', true);
    }

    return (await query.get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IClasse;
      })
      .sort((a: IClasse, b: IClasse) => {
        return a.nom.localeCompare(b.nom);
      })
  }

  public async getClasse(id: string, full?: boolean): Promise<IClasse> {
    const data = await this.afs.doc<IClasse>(`classes/${id}`).ref.get();
    let classe = {
      id: data.id,
      ...data.data()
    } as IClasse;

    if (full) {
      await Promise.all([
        this._getMulticlassement(classe),
        this._getAptitudes(classe),
        this._getSorts(classe),
        this._getDons(classe),
        this._getResistances(classe),
        this._getStatistiques(classe),
        this._getImmunites(classe)
      ]);
    }

    return classe;
  }

  public async addClasse(classe: IClasse): Promise<IClasse> {
    const data = await this.afs.collection(`classes`).add(this._saveState(classe));
    return { id: data.id, ...classe } as IClasse;
  }

  public async updateClasse(classe: IClasse): Promise<IClasse> {
    await this.afs.doc<IClasse>(`classes/${classe.id}`).update(this._saveState(classe));
    return classe;
  }

  public async deleteClasse(id: string): Promise<boolean> {
    await this.afs.doc<IClasse>(`classes/${id}`).delete();
    return true;
  }

  public async getAvailableClasses(personnage: IPersonnage): Promise<IClasse[]> {

    let list = await this.getClasses();

    // Filtre selon la race
    if (personnage.race) {
      list = list.filter((classe) => {
        return personnage.race.classesDisponibleRef.includes(classe.id);
      });
    }

    // Filtre selon les classes
    if (personnage?.classes?.length) {
      personnage.classes.forEach(classePerso => {

        // Multiclassement
        list = list.filter((classe) => {
          return classePerso.classe.multiclassementRef.includes(classe.id);
        });

        // Ajoute la classe actuelle (Filtré au multiclassement);
        list.push(classePerso.classe);

        // Alignement Permis
        if (personnage.alignementRef) {
          list = list.filter((classe) => {
            return classePerso.classe.alignementPermisRef.includes(personnage.alignementRef);
          });
        }

      });
    }

    // Ordres
    if (personnage?.ordres?.length) {
      personnage.ordres.forEach(ordre => {
        list = list.filter((classe) => {
          return ordre.classeRef.includes(classe.id);
        });
      })
    }

    // Domaines
    if (personnage?.domaines?.length) {
      personnage.domaines.forEach(domaine => {
        list = list.filter((classe) => {
          return domaine.multiclassementRef.includes(classe.id);
        });
      })
    }

    // Ajoute les classes existante
    if (personnage.classes) {

      // Retire les autres classes si déjà 3 existantes
      if (personnage.classes.length >= 3) {
        list = [];
      }

      // Ajoute Chaques classe existante
      personnage.classes.forEach(classePerso => {
        list.push(classePerso.classe);
      });

      // Filtre les doubles
      list = list.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === pos;
      });

    }

    // Trie en Ordre Alphabetic
    list = list.sort((a, b) => {
      if (a.nom > b.nom) {
        return 1;
      }
      if (a.nom < b.nom) {
        return -1;
      }
      return 0;
    });

    return list;
  }

  public async getPersonnageClasses(personnage: IPersonnage): Promise<IPersonnage> {
    if (personnage?.classes?.length) {
      await Promise.all(
        personnage.classes.map(async (classeItem) => {
          classeItem.classe = await this.getClasse(classeItem.classeRef, true);
        })
      );
    }
    return personnage;
  }

  private _saveState(item: IClasse): IClasseDB {
    if (!item.aptitudes) item.aptitudes = [];
    if (!item.dons) item.dons = [];
    if (!item.sorts) item.sorts = [];
    if (!item.sortsDisponible) item.sortsDisponible = [];
    if (!item.choix) item.choix = [];
    if (!item.resistances) item.resistances = [];
    if (!item.statistiques) item.statistiques = [];
    if (!item.immunitesRef) item.immunitesRef = [];
    if (!item.prestige) item.prestige = false;

    //Filter Out
    item.aptitudes.forEach(aptitude => {
      aptitude.aptitude = null;
    });

    item.dons.forEach(don => {
      don.don = null;
    });

    item.sorts.forEach(sort => {
      sort.sort = null;
    });

    item.sortsDisponible.forEach(sort => {
      sort.sort = null;
    });

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
      multiclassementRef: item.multiclassementRef,
      aptitudes: item.aptitudes.map((obj) => { return { ...obj } }),
      dons: item.dons.map((obj) => { return { ...obj } }),
      sorts: item.sorts.map((obj) => { return { ...obj } }),
      sortsDisponible: item.sortsDisponible.map((obj) => { return { ...obj } }),
      choix: item.choix.map((obj) => { return { ...obj } }),
      statistiques: item.statistiques.map((obj) => { return { ...obj } }),
      resistances: item.resistances.map((obj) => { return { ...obj } }),
      immunitesRef: item.immunitesRef,
      type: item.type,
      sort: item.sort,
      prestige: item.prestige
    };
  }

  private _getMulticlassement(classe: IClasse): void {
    if (classe?.multiclassementRef?.length) {
      classe.multiclassementRef.forEach(async (classeRef) => {
        const classe = await this.getClasse(classeRef);
        if (!classe.multiclassement) classe.multiclassement = [];
        classe.multiclassement.push(classe);
      });
    }
  }

  private async _getAptitudes(classe: IClasse): Promise<void> {
    if (classe?.aptitudes?.length) {
      await Promise.all(
        classe?.aptitudes.map(async (aptitudeItem: AptitudeItem) => {
          aptitudeItem.aptitude = await this.aptitudeService.getAptitude(aptitudeItem.aptitudeRef);
        })
      )
    }
  }

  private async _getDons(classe: IClasse): Promise<void> {
    if (classe?.dons?.length) {
      await Promise.all(
        classe.dons.map(async (donItem: DonItem) => {
          donItem.don = await this.donService.getDon(donItem.donRef);
        })
      )
    }
  }

  private async _getSorts(classe: IClasse): Promise<void> {
    if (classe?.sorts?.length) {
      await Promise.all(
        classe.sorts.map(async (sortItem: SortItem) => {
          sortItem.sort = await this.sortService.getSort(sortItem.sortRef);
        })
      );
    }
  }

  private async _getResistances(classe: IClasse): Promise<void> {
    if (classe?.resistances?.length) {
      await Promise.all(
        classe.resistances.map(async (resistanceItem: ResistanceItem) => {
          resistanceItem.resistance = await this.resistanceService.getResistance(resistanceItem.resistanceRef);
        })
      );
    }
  }

  private async _getStatistiques(classe: IClasse): Promise<void> {
    if (classe?.statistiques?.length) {
      await Promise.all(
        classe.statistiques.map(async (statistiqueItem: StatistiqueItem) => {
          statistiqueItem.statistique = await this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef);
        })
      );
    }
  }

  private async _getImmunites(classe: IClasse): Promise<void> {
    if (classe?.immunitesRef?.length) {
      await Promise.all(
        classe.immunitesRef.map(async (immuniteRef) => {
          if (!classe.immunites) classe.immunites = [];
          classe.immunites.push(await this.immuniteService.getImmunite(immuniteRef));
        })
      )
    }
  }

}