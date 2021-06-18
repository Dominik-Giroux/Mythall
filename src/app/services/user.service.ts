import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPersonnage } from './personnage.service';

export interface IRoles {
  joueur?: boolean;
  animateur?: boolean;
  organisateur?: boolean;
}

export interface IUser extends IUserDB {

}

export interface IUserDB {
  uid: string;
  displayname: string;
  photoURL: string;
  email: string;
  roles: IRoles;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  //#region Service
  public async getUsers(): Promise<IUser[]> {
    return (await this.afs.collection<IUser>('users').ref.orderBy('displayname').get()).docs.map(doc => {
      return {
        uid: doc.id,
        ...doc.data()
      } as IUser;
    });
  }

  public async getUser(id: string): Promise<IUser> {
    const data = await this.afs.doc<IUser>(`users/${id}`).ref.get();
    return {
      uid: data.id,
      ...data.data()
    } as IUser;
  }

  public async addUser(user: IUser): Promise<IUser> {
    const data = await this.afs.collection(`users`).add(this._saveState(user));
    return { id: data.id, ...user } as IUser;
  }

  public async updateUser(user: IUser): Promise<IUser> {
    await this.afs.doc<IUser>(`users/${user.uid}`).set(this._saveState(user), { merge: true });
    return user;
  }

  public async deleteUser(id: string): Promise<boolean> {
    await this.afs.doc<IUser>(`users/${id}`).delete();
    return true;
  }

  public async getPersonnageUser(personnage: IPersonnage): Promise<IPersonnage> {
    personnage.user = await this.getUser(personnage.userRef)
    return personnage;
  }

  private _saveState(item: IUser): IUserDB {
    return {
      uid: item.uid,
      displayname: item.displayname,
      photoURL: item.photoURL,
      email: item.email,
      roles: item.roles,
      createdAt: item.createdAt,
      updatedAt: new Date(),
    };
  }

}