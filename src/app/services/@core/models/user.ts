import { Timestamp } from '@firebase/firestore-types';
import { Roles } from "./roles";

export class User {

  constructor() {
    this.roles = new Roles();
  }

  uid: string;
  displayname: string;
  photoURL: string;
  email: string;
  roles: Roles;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  saveState(): any {

    var user: any = {
      uid: this.uid,
      displayname: this.displayname,
      photoURL: this.photoURL,
      email: this.email,
      roles: this.roles,
    };
    return user;
  }

}