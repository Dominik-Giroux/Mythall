import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserService, IUser } from './user.service';
import { ErrorDialogComponent } from '../layout/dialogs/error/error.dialog.component';

@Injectable()
export class AuthenticationService {

  // public user$: Observable<IUser>;
  
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService
  ) {
    // this.setUser();
  }

  public async user(): Promise<IUser> {
    const auth = await this.afAuth.authState.toPromise();
    const user = await this.userService.getUser(auth.uid);
    return user;
  }

  // private setUser() {
  //   this.afAuth.authState.pipe(
  //     switchMap(async (user) => {
  //       if (user) {
  //         this.user$ = this.afs.doc<IUser>(`users/${user.uid}`).valueChanges();
  //         this.user = await this.userService.getUser(user.uid);
  //       }
  //     })
  //   )
  // }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate([""]);
    });
  }

  private async oAuthLogin(provider): Promise<void> {
    try {
      await this.updateUserData(await this.afAuth.auth.signInWithPopup(provider));
      this.router.navigate([""]);
    } catch (error) {
      this.dialog.open(ErrorDialogComponent, {
        data: error.message
      });
    }
  }

  private async updateUserData(user: any): Promise<void> {

    //Create new User
    let updatedUser = {
      roles: {
        joueur: true,
      },
    } as IUser;

    //Update Data from Credentials
    updatedUser.uid = user.user.uid;
    updatedUser.displayname = user.user.displayName;
    updatedUser.email = user.user.email;
    updatedUser.photoURL = user.user.photoURL;

    const userDB = await this.userService.getUser(updatedUser.uid);

    if (!userDB || userDB.uid === 'undefined') {
      updatedUser.createdAt = new Date();
      updatedUser.roles = { ...updatedUser.roles };
      await this.userService.addUser(updatedUser);
    } else {
      updatedUser = { ...updatedUser, ...userDB };
      updatedUser.updatedAt = new Date();
      await this.userService.updateUser(updatedUser);
    }
  }

  isJoueur(user: IUser): boolean {
    const allowed = ['organisateur', 'animateur', 'joueur']
    return this.checkAuthorization(user, allowed)
  }

  isAnimateur(user: IUser): boolean {
    const allowed = ['organisateur', 'animateur']
    return this.checkAuthorization(user, allowed)
  }

  isOrganisateur(user: IUser): boolean {
    const allowed = ['organisateur']
    return this.checkAuthorization(user, allowed)
  }

  private checkAuthorization(user: IUser, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if (user) {
        if (user.roles[role]) {
          return true
        }
      }
    }
    return false
  }

}