import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';
import { Ecole } from '../models/ecole';
import { Observable } from 'rxjs';

@Injectable()
export class EcoleService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'ecoles/';

  getEcoles$(): Observable<Ecole[]> {
    return this.afs.collection<Ecole>('ecoles', ref => ref.orderBy("nom")).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Ecole;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getEcoles(): Observable<Ecole[]> {
    return this.http.get(this.url).map((res: Ecole[]) => res);
  }

  getEcole(id: string): Observable<Ecole> {
    return this.http.get(this.url + id).map((res: Ecole) => res);
  }

  addEcole(ecole: Ecole): Observable<Ecole> {
    return this.http.post(this.url, ecole.saveState()).map((res: Ecole) => res);
  }

  updateEcole(ecole: Ecole): Observable<Ecole> {
    return this.http.put(this.url, { id: ecole.id, data: ecole.saveState() }).map((res: Ecole) => res);
  }

  deleteEcole(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).map((res: boolean) => res);
  }

}