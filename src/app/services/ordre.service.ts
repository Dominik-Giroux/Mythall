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
    this.getClasses(order);
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

    // Retourne seulement la liste des ordres du personnage
    let count: number = 0;
    if (!personnage.ordresRef) personnage.ordresRef = [];

    if (personnage.ordresRef && personnage.ordresRef.length > 0) {
      personnage.ordresRef.forEach(async (ordreRef) => {
        const ordre = await this.getOrdre(ordreRef);
        if (!personnage.ordres) personnage.ordres = [];
        personnage.ordres.push(ordre);
        count++;
        if (count == personnage.ordresRef.length) {
          return personnage;
        }
      });
    } else {
      return personnage;
    }
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

  private getClasses(ordre: IOrdre): void {
    if (ordre.multiclassementRef) {
      ordre.multiclassementRef.forEach(async (classeRef) => {
        if (!ordre.multiclassement) ordre.multiclassement = [];
        ordre.multiclassement.push(await this.classeService.getClasse(classeRef));
      });
    }
  }

}