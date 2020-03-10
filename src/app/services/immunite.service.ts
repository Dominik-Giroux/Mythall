import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Immunite } from '../models/immunite';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ImmuniteService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'immunites/';

  getImmunites$(): Observable<Immunite[]> {
    return this.afs.collection<Immunite>('immunites', ref => ref.orderBy("nom")).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Immunite;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getImmunites(): Observable<Immunite[]> {
    return this.http.get(this.url).pipe(map((res: Immunite[]) => res));
  }

  getImmunite(id: string): Observable<Immunite> {
    return this.http.get(this.url + id).pipe(map((res: Immunite) => res));
  }

  addImmunite(immunite: Immunite): Observable<Immunite> {
    return this.http.post(this.url, immunite.saveState()).pipe(map((res: Immunite) => res));
  }

  updateImmunite(immunite: Immunite): Observable<Immunite> {
    return this.http.put(this.url, { id: immunite.id, data: immunite.saveState() }).pipe(map((res: Immunite) => res));
  }

  deleteImmunite(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}