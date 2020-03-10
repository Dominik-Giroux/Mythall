import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Porte } from '../models/porte';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PorteService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'portes/';

  getPortes$(): Observable<Porte[]> {
    return this.afs.collection<Porte>('portes', ref => ref.orderBy("nom")).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Porte;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getPortes(): Observable<Porte[]> {
    return this.http.get(this.url).pipe(map((res: Porte[]) => res));
  }

  getPorte(id: string): Observable<Porte> {
    return this.http.get(this.url + id).pipe(map((res: Porte) => res));
  }

  addPorte(porte: Porte): Observable<Porte> {
    return this.http.post(this.url, porte.saveState()).pipe(map((res: Porte) => res));
  }

  updatePorte(porte: Porte): Observable<Porte> {
    return this.http.put(this.url, { id: porte.id, data: porte.saveState() }).pipe(map((res: Porte) => res));
  }

  deletePorte(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}