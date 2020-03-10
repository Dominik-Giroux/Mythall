import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Dieu } from '../models/dieu';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DieuService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'dieux/';

  getDieux$(): Observable<Dieu[]> {
    return this.afs.collection<Dieu>('dieux').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Dieu;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getDieux(): Observable<Dieu[]> {
    return this.http.get(this.url).pipe(map((res: Dieu[]) => res));
  }

  getDieu(id: string): Observable<Dieu> {
    return this.http.get(this.url + id).pipe(map((res: Dieu) => res));
  }

  addDieu(dieu: Dieu): Observable<Dieu> {
    return this.http.post(this.url, dieu.saveState()).pipe(map((res: Dieu) => res));
  }

  updateDieu(dieu: Dieu): Observable<Dieu> {
    return this.http.put(this.url, { id: dieu.id, data: dieu.saveState() }).pipe(map((res: Dieu) => res));
  }

  deleteDieu(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}