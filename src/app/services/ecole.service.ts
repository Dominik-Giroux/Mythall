import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface IEcole extends IEcoleDB {
  id: string;
}

export interface IEcoleDB {
  nom: string;
}

@Injectable()
export class EcoleService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public async getEcoles(): Promise<IEcole[]> {
    return (await this.afs.collection<IEcole>('ecoles').ref.orderBy('nom').get()).docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as IEcole;
    });
  }

  public async getEcole(id: string): Promise<IEcole> {
    const data = await this.afs.doc<IEcole>(`ecoles/${id}`).ref.get();
    return {
      id: data.id,
      ...data.data()
    } as IEcole;
  }

  public async addEcole(ecole: IEcole): Promise<IEcole> {
    const data = await this.afs.collection(`ecoles`).add(this._saveState(ecole));
    return { id: data.id, ...ecole } as IEcole;
  }

  public async updateEcole(ecole: IEcole): Promise<IEcole> {
    await this.afs.doc<IEcole>(`ecoles/${ecole.id}`).update(this._saveState(ecole));
    return ecole;
  }

  public async deleteEcole(id: string): Promise<boolean> {
    await this.afs.doc<IEcole>(`ecoles/${id}`).delete();
    return true;
  }

  public async getAvailableEcoles(): Promise<IEcole[]> {
    return await this.getEcoles();
  }

  private _saveState(item: IEcole): IEcoleDB {
    return {
      nom: item.nom,
    };
  }
}