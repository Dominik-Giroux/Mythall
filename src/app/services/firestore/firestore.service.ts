import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import * as firebase from 'firebase';

import { MatSnackBar } from '@angular/material/snack-bar';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable()
export class FirestoreService {

  constructor(
    public afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) { }

  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref
  }

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => {
        const data: any = doc.payload.data();
        data.id = doc.payload.id;
        return data as T;
      })
    )
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(docs => {
        return docs.map(a => a.payload.doc.data()) as T[]
      })
    );
  }

  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  get timestamp() {
    return Date.now();
  }

  add<T>(ref: CollectionPredicate<T>, data, snackbarDisplay) {
    const timestamp = this.timestamp
    var snackBar = this.snackBar;
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    }).then(function (docRef) {
      snackBar.open(snackbarDisplay + " ajouté avec succès.", "Dismiss", {
        duration: 3000,
      });
      return true;
    }).catch(function (error) {
      return false;
    });

  }

  update<T>(ref: DocPredicate<T>, data: any, snackbarDisplay?) {
    var snackBar = this.snackBar;
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp
    }).then(function () {
      if (snackbarDisplay) {
        snackBar.open(snackbarDisplay + " modifié avec succès.", "Dismiss", {
          duration: 3000,
        });
      }
      return true;
    }).catch(function (error) {
      snackBar.open("Une erreure est survenue lors de la modification, veuilliez réessayer.");
      console.log(error);
      return false;
    })
  }

  set<T>(ref: DocPredicate<T>, data: any, snackbarDisplay?) {
    var snackBar = this.snackBar;
    const timestamp = this.timestamp
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    }).then(function () {
      if (snackbarDisplay) {
        snackBar.open(snackbarDisplay + " modifié avec succès.", "Dismiss", {
          duration: 3000,
        });
      }
      return true;
    }).catch(function (error) {
      snackBar.open("Une erreure est survenue lors de la modification, veuilliez réessayer.");
      console.log(error);
      return false;
    })
  }

  delete<T>(ref: DocPredicate<T>, snackbarDisplay) {
    var snackBar = this.snackBar;
    return this.doc(ref).delete().then(function () {
      snackBar.open(snackbarDisplay + " supprimé avec succès.", "Dismiss", {
        duration: 3000,
      });
      return true;
    }).catch(function (error) {
      return false;
    });
  }

  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref })
  }

  getCollection(collection: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.afs.collection(collection).get().subscribe(
        querySnapshot => {
          let result: any[] = [];
          querySnapshot.forEach(function (doc) {
            const data: any = doc.data();
            data.id = doc.id;
            result.push(data);
          });
          resolve(result);
        },
        error => reject(error)
      )
    });
  }

}