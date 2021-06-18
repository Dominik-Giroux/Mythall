import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ClasseService, IClasse } from './classe.service';
import { IAlignement } from './alignement.service';
import { IPersonnage } from './personnage.service';

export interface IOrdre extends IOrdreDB {
  id: string;
  multiclassement: IClasse[];
  alignementPermis: IAlignement[];
}

export interface IOrdreDB {
  nom: string;
  description: string;
  classeRef: string[];
  multiclassementRef: string[];
  alignementPermisRef: string[];
}

@Injectable()
export class OrdreService {

  constructor(
    private afs: AngularFirestore,
    private classeService: ClasseService
  ) { }

  public async getOrdres(): Promise<IOrdre[]> {
    return (await this.afs.collection<IOrdre>('ordres').ref.orderBy('nom').get()).docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as IOrdre;
    });
  }

  public async getOrdre(id: string): Promise<IOrdre> {
    const data = await this.afs.doc<IOrdre>(`ordres/${id}`).ref.get();
    const order = {
      id: data.id,
      ...data.data()
    } as IOrdre;
    await this._getClasses(order);
    return order;
  }

  public async addOrdre(ordre: IOrdre): Promise<IOrdre> {
    const data = await this.afs.collection(`ordres`).add(this._saveState(ordre));
    return { id: data.id, ...ordre } as IOrdre;
  }

  public async updateOrdre(ordre: IOrdre): Promise<IOrdre> {
    await this.afs.doc<IOrdre>(`ordres/${ordre.id}`).update(this._saveState(ordre));
    return ordre;
  }

  public async deleteOrdre(id: string): Promise<boolean> {
    await this.afs.doc<IOrdre>(`ordres/${id}`).delete();
    return true;
  }

  public async getAvailableOrdres(personnage: IPersonnage): Promise<IOrdre[]> {

    const ordres = await this.getOrdres();

    let list: IOrdre[] = ordres;

    // Filtre selon l'alignement du personnage
    if (personnage.alignementRef) {
      list = list.filter(function (ordre) {
        return ordre.alignementPermisRef.includes(personnage.alignementRef);
      });
    }

    // Filtre selon les classes
    if (personnage.classes) {
      personnage.classes.forEach(classe => {
        list = list.filter(function (ordre) {
          return ordre.classeRef.includes(classe.classeRef);
        });
      });
    }

    return list;

  }

  public async getPersonnageOrdres(personnage: IPersonnage): Promise<IPersonnage> {
    if (!personnage.ordresRef) personnage.ordresRef = [];

    if (personnage?.ordresRef?.length) {
      await Promise.all(
        personnage.ordresRef.map(async (ordreRef) => {
          if (!personnage.ordres) personnage.ordres = [];
          personnage.ordres.push(await this.getOrdre(ordreRef));
        })
      );
    }

    return personnage;
  }

  private _saveState(item: IOrdre): IOrdreDB {
    return {
      nom: item.nom,
      description: item.description,
      classeRef: item.classeRef,
      multiclassementRef: item.multiclassementRef,
      alignementPermisRef: item.alignementPermisRef
    };
  }

  private async _getClasses(ordre: IOrdre): Promise<void> {
    if (ordre?.multiclassementRef?.length) {
      await Promise.all(
        ordre.multiclassementRef.map(async (classeRef) => {
          if (!ordre.multiclassement) ordre.multiclassement = [];
          ordre.multiclassement.push(await this.classeService.getClasse(classeRef));
        })
      )
    }
  }

}