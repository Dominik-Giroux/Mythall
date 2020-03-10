import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Statistique } from '../models/statistique';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StatistiqueService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'statistiques/';

  getStatistiques$(): Observable<Statistique[]> {
    return this.afs.collection<Statistique>('statistiques', ref => ref.orderBy("nom")).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Statistique;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getStatistiques(): Observable<Statistique[]> {
    return this.http.get(this.url).pipe(map((res: Statistique[]) => res));
  }

  getStatistique(id: string): Observable<Statistique> {
    return this.http.get(this.url + id).pipe(map((res: Statistique) => res));
  }

  addStatistique(statistique: Statistique): Observable<Statistique> {
    return this.http.post(this.url, statistique.saveState()).pipe(map((res: Statistique) => res));
  }

  updateStatistique(statistique: Statistique): Observable<Statistique> {
    return this.http.put(this.url, { id: statistique.id, data: statistique.saveState() }).pipe(map((res: Statistique) => res));
  }

  deleteStatistique(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}