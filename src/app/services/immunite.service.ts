import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPersonnage } from './personnage.service';

export interface IImmunite extends IImmuniteDB {
  id: string;
}

export interface IImmuniteDB {
  nom: string;
}

@Injectable()
export class ImmuniteService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public async getImmunites(): Promise<IImmunite[]> {
    return (await this.afs.collection<IImmunite>('immunites').ref.orderBy('nom').get()).docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as IImmunite;
    });
  }

  public async getImmunite(id: string): Promise<IImmunite> {
    const data = await this.afs.doc<IImmunite>(`immunites/${id}`).ref.get();
    return {
      id: data.id,
      ...data.data()
    } as IImmunite;
  }

  public async addImmunite(immunite: IImmunite): Promise<IImmunite> {
    const data = await this.afs.collection(`immunites`).add(this._saveState(immunite));
    return { id: data.id, ...immunite } as IImmunite;
  }

  public async updateImmunite(immunite: IImmunite): Promise<IImmunite> {
    await this.afs.doc<IImmunite>(`immunites/${immunite.id}`).update(this._saveState(immunite));
    return immunite;
  }

  public async deleteImmunite(id: string): Promise<boolean> {
    await this.afs.doc<IImmunite>(`immunites/${id}`).delete();
    return true;
  }

  public async getPersonnageImmunites(personnage: IPersonnage): Promise<IPersonnage> {

    if (!personnage.immunites) personnage.immunites = [];

    //Race Immunites
    if (personnage.race.immunites) {
      personnage.immunites = [...personnage.immunites, ...personnage.race.immunites];
    }

    //Classes Immunites
    if (personnage.classes && personnage.classes.length > 0) {
      personnage.classes.forEach(classeItem => {
        if (classeItem.classe.immunites) {
          personnage.immunites = [...personnage.immunites, ...classeItem.classe.immunites];
        }
      })
    }

    //Aptitudes Immunites
    if (personnage.aptitudes) {
      personnage.aptitudes.forEach(aptitudeItem => {
        if (aptitudeItem.aptitude && aptitudeItem.aptitude.immunites) {
          personnage.immunites = [...personnage.immunites, ...aptitudeItem.aptitude.immunites];
        }
      })
    }

    //Dons Immunites
    if (personnage.dons) {
      personnage.dons.forEach(donItem => {
        if (donItem.don && donItem.don.immunites) {
          personnage.immunites = [...personnage.immunites, ...donItem.don.immunites];
        }
      })
    }

    return personnage;

  }

  private _saveState(item: IImmunite): IImmuniteDB {
    return {
      nom: item.nom,
    };
  }

}