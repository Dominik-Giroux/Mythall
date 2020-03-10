import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../firestore/firestore.service';

import { UserService } from './user.service';
import { User } from './models/user';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../layout/dialogs/error/error.dialog.component';

@Injectable()
export class AuthenticationService {

    private auth: firebase.auth.Auth;
    public user: Observable<User>;

    constructor(
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth,
        private db: FirestoreService,
        private dialog: MatDialog,
        private router: Router,
        private userService: UserService
    ) {
        this.setUser();
    }

    private setUser() {
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null)
                }
            })
        )
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.oAuthLogin(provider);
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider()
        return this.oAuthLogin(provider);
    }

    logout() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate([""]);
        });
    }

    private oAuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                this.updateUserData(credential.user)
            }).then(
                () => this.router.navigate([""])
            ).catch(error => {
                let dialogRef = this.dialog.open(ErrorDialogComponent, {
                    data: error.message
                });
            });
    }

    private updateUserData(user) {

        //Set Reference
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
        userRef.ref.get().then(doc => {

            //Create new User
            let updatedUser: User = new User();

            //Update Data from Credentials
            updatedUser.uid = user.uid;
            updatedUser.displayname = user.displayName;
            updatedUser.email = user.email;
            updatedUser.photoURL = user.photoURL;
            updatedUser.createdAt = firebase.firestore.Timestamp.now();

            if (!doc.exists) {
                updatedUser.roles = Object.assign({}, updatedUser.roles);
                userRef.ref.set(Object.assign({}, updatedUser), { merge: true });
            } else {

                const response = doc.data();
                updatedUser = this.userService.map(response);
                updatedUser.updatedAt = firebase.firestore.Timestamp.now();
                userRef.ref.set(Object.assign({}, updatedUser), { merge: true });

            }

        }).catch(error => {
            let dialogRef = this.dialog.open(ErrorDialogComponent, {
                data: error.message
            });
        });

    }

    isJoueur(user: any): boolean {
        const allowed = ['organisateur', 'animateur', 'joueur']
        return this.checkAuthorization(user, allowed)
    }

    isAnimateur(user: any): boolean {
        const allowed = ['organisateur', 'animateur']
        return this.checkAuthorization(user, allowed)
    }

    isOrganisateur(user: any): boolean {
        const allowed = ['organisateur']
        return this.checkAuthorization(user, allowed)
    }

    private checkAuthorization(user: User, allowedRoles: string[]): boolean {
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