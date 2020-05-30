import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IAlignement } from "../services/alignement.service";
import { IDomaine } from './domaine.service';
import { IPersonnage } from './personnage.service';

export interface IDieu extends IDieuDB {
  id: string;
  alignement: IAlignement;
  alignementPermis: IAlignement[];
  domaines: IDomaine[];
}

export interface IDieuDB {
  nom: string;
  prononciation: string;
  titre: string;
  rang: string;
  alignementRef: string;
  alignementPermisRef: string[];
  domainesRef: string[];
  armeDePredilection: string;
  relations: string;
  dogmes: string;
}

@Injectable()
export class DieuService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public async getDieux(): Promise<IDieu[]> {
    return (await this.afs.collection<IDieu>('dieux').ref.get()).docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as IDieu;
    });
  }

  public async getDieu(id: string): Promise<IDieu> {
    const data = await this.afs.doc<IDieu>(`dieux/${id}`).ref.get();
    return {
      id: data.id,
      ...data.data()
    } as IDieu;
  }

  public async addDieu(dieu: IDieu): Promise<IDieu> {
    const data = await this.afs.collection(`dieux`).add(this._saveState(dieu));
    return { id: data.id, ...dieu } as IDieu;
  }

  public async updateDieu(dieu: IDieu): Promise<IDieu> {
    await this.afs.doc<IDieu>(`dieux/${dieu.id}`).update(this._saveState(dieu));
    return dieu;
  }

  public async deleteDieu(id: string): Promise<boolean> {
    await this.afs.doc<IDieu>(`dieux/${id}`).delete();
    return true;
  }

  public async getAvailableDieux(personnage: IPersonnage): Promise<IDieu[]> {

    let list = await this.getDieux();

    // Filtre selon l'alignement du personnage
    if (personnage.alignementRef) {
      list = list.filter(function (dieu) {
        return dieu.alignementPermisRef.includes(personnage.alignementRef);
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

  public async getPersonnageDieu(personnage: IPersonnage): Promise<IPersonnage> {
    if (personnage.dieuRef) {
      personnage.dieu = await this.getDieu(personnage.dieuRef);
    }
    return personnage;
  }

  private _saveState(item: IDieu): IDieuDB {
    return {
      nom: item.nom,
      prononciation: item.prononciation,
      titre: item.titre,
      rang: item.rang,
      alignementRef: item.alignementRef,
      alignementPermisRef: item.alignementPermisRef,
      domainesRef: item.domainesRef,
      armeDePredilection: item.armeDePredilection,
      relations: item.relations,
      dogmes: item.dogmes,
    };
  }

}