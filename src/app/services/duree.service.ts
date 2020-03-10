import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Duree } from '../models/duree';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DureeService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'durees/';

  getDurees$(): Observable<Duree[]> {
    return this.afs.collection<Duree>('durees', ref => ref.orderBy("nom")).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Duree;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getDurees(): Observable<Duree[]> {
    return this.http.get(this.url).pipe(map((res: Duree[]) => res));
  }

  getDuree(id: string): Observable<Duree> {
    return this.http.get(this.url + id).pipe(map((res: Duree) => res));
  }

  addDuree(duree: Duree): Observable<Duree> {
    return this.http.post(this.url, duree.saveState()).pipe(map((res: Duree) => res));
  }

  updateDuree(duree: Duree): Observable<Duree> {
    return this.http.put(this.url, { id: duree.id, data: duree.saveState() }).pipe(map((res: Duree) => res));
  }

  deleteDuree(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}