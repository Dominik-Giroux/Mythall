import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StatistiqueService, IStatistique } from './statistique.service';
import { IDon } from './don.service';
import { IPersonnage } from './personnage.service';

export interface IFourberie extends IFourberieDB {
  id: string;
  modificateur: IStatistique;
  fourberiesRequis: IFourberie[];
  donsEquivalent: IDon[];
}

export interface IFourberieDB {
  nom: string;
  description: string;
  afficherNiveau: boolean;
  modificateurRef: string;
  fourberiesRequisRef: string[];
  donsEquivalentRef: string[];
}

export class FourberieItem {
  constructor() {
    this.fourberie = null;
    this.fourberieRef = '';
    this.niveauObtention = 1;
    this.niveauEffectif = 1;
  }

  fourberie: IFourberie;
  fourberieRef: string;
  niveauObtention: number;
  niveauEffectif: number;
}

@Injectable()
export class FourberieService {

  constructor(
    private afs: AngularFirestore,
    private statistiqueService: StatistiqueService,
  ) { }

  public async getFourberies(): Promise<IFourberie[]> {
    return (await this.afs.collection<IFourberie>('fourberies').ref.orderBy('nom').get()).docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as IFourberie;
    });
  }

  public async getFourberie(id: string): Promise<IFourberie> {
    const data = await this.afs.doc<IFourberie>(`fourberies/${id}`).ref.get();
    const fourberie = {
      id: data.id,
      ...data.data()
    } as IFourberie;
    await Promise.all([
      this._getFourberiesRequis(fourberie),
      this._getModificateur(fourberie)
    ]);
    return fourberie;
  }

  public async addFourberie(fourberie: IFourberie): Promise<IFourberie> {
    const data = await this.afs.collection(`fourberies`).add(this._saveState(fourberie));
    return { id: data.id, ...fourberie } as IFourberie;
  }

  public async updateFourberie(fourberie: IFourberie): Promise<IFourberie> {
    await this.afs.doc<IFourberie>(`fourberies/${fourberie.id}`).update(this._saveState(fourberie));
    return fourberie;
  }

  public async deleteFourberie(id: string): Promise<boolean> {
    await this.afs.doc<IFourberie>(`fourberies/${id}`).delete();
    return true;
  }

  public async getAvailableFourberies(personnage: IPersonnage): Promise<IFourberie[]> {

    const fourberies = await this.getFourberies();

    let list: IFourberie[] = fourberies;

    // Filtre les fourberies déjà existant
    if (personnage?.fourberies?.length) {
      personnage.fourberies.forEach(fourberiesPerso => {

        list = list.filter(fourberie => {
          return fourberie.id != fourberiesPerso.fourberieRef;
        })

      });
    }

    // Filtre les prérequis de fourberie
    if (personnage.fourberies) {

      let result: IFourberie[] = [];

      list.forEach(fourberie => {

        let add: boolean = true;

        // No requirements
        if (fourberie?.fourberiesRequisRef?.length) {

          // Make sure all requirements is filled
          fourberie.fourberiesRequisRef.forEach(fourberieReqRef => {

            let found: boolean = false;

            personnage.fourberies.forEach(fourberiePerso => {

              if (fourberieReqRef == fourberiePerso.fourberieRef) {
                found = true;
              }

            });

            if (!found) {
              add = false;
            }

          });
        }

        if (add) {
          result.push(fourberie);
        }

      });

      list = result;

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

  public async getPersonnageFourberies(personnage: IPersonnage): Promise<IPersonnage> {

    if (!personnage.fourberies) personnage.fourberies = [];

    // Remplis la liste de fourberies complète
    if (personnage?.fourberies?.length) {
      await Promise.all(
        personnage.fourberies.map(async (fourberieItem) => {
          fourberieItem.fourberie = await this.getFourberie(fourberieItem.fourberieRef);
        })
      );
    }

    // Filter Duplicates
    personnage.fourberies = personnage.fourberies.filter((fourberie, index, self) =>
      index === self.findIndex((d) => (
        d.fourberieRef === fourberie.fourberieRef
      ))
    )

    return personnage;

  }

  private _saveState(fourberie: IFourberie): IFourberieDB {

    const result = {
      nom: fourberie.nom,
      description: fourberie.description,
      afficherNiveau: fourberie.afficherNiveau,
      fourberiesRequisRef: fourberie.fourberiesRequisRef,
      donsEquivalentRef: fourberie.donsEquivalentRef,
    } as IFourberieDB;

    if (!result.afficherNiveau) result.afficherNiveau = false;
    if (!result.fourberiesRequisRef) result.fourberiesRequisRef = [];
    if (!result.donsEquivalentRef) result.donsEquivalentRef = [];

    if (fourberie.modificateurRef) {
      result.modificateurRef = fourberie.modificateurRef;
    }

    return result;
  }

  private async _getFourberiesRequis(fourberie: IFourberie): Promise<void> {
    if (fourberie?.fourberiesRequisRef?.length) {
      await Promise.all(
        fourberie.fourberiesRequisRef.map(async (fourberieRequisRef) => {
          if (!fourberie.fourberiesRequis) fourberie.fourberiesRequis = [];
          fourberie.fourberiesRequis.push(await this.getFourberie(fourberieRequisRef));
        })
      );
    }
  }

  private async _getModificateur(fourberie: IFourberie): Promise<void> {
    if (fourberie.modificateurRef) {
      fourberie.modificateur = await this.statistiqueService.getStatistique(fourberie.modificateurRef);
    }
  }

}