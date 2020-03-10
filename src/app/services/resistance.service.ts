import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Resistance } from '../models/resistance';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResistanceService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'resistances/';

  getResistances$(): Observable<Resistance[]> {
    return this.afs.collection<Resistance>('resistances', ref => ref.orderBy("nom")).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Resistance;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getResistances(): Observable<Resistance[]> {
    return this.http.get(this.url).pipe(map((res: Resistance[]) => res));
  }

  getResistance(id: string): Observable<Resistance> {
    return this.http.get(this.url + id).pipe(map((res: Resistance) => res));
  }

  addResistance(resistance: Resistance): Observable<Resistance> {
    return this.http.post(this.url, resistance.saveState()).pipe(map((res: Resistance) => res));
  }

  updateResistance(resistance: Resistance): Observable<Resistance> {
    return this.http.put(this.url, { id: resistance.id, data: resistance.saveState() }).pipe(map((res: Resistance) => res));
  }

  deleteResistance(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}