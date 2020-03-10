import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { User } from './models/user';

@Injectable()
export class UserService {

  constructor(
    private db: FirestoreService
  ) { }

  //#region Service
  getUsers(): Observable<User[]> {
    return this.db.colWithIds$('users', ref => ref.orderBy('displayname'));
  }

  getUser(uid: string): Observable<User> {
    return this.db.doc$('users/' + uid);
  }

  updateUser(uid: string, user: User) {
    return this.db.update('users/' + uid, user, user.displayname);
  }

  deleteUser(user: User) {
    return this.db.delete('users/' + user.uid, user.displayname);
  }
  //#endregion


  //#region Maps
  map(data: any): User {
    const user: User = new User();
    for (var key in data) {
      user[key] = data[key]
    }
    return user;
  }
  //#endregion

}