import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Zone } from '../models/zone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ZoneService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  private url = environment.api + 'zones/';

  getZones$(): Observable<Zone[]> {
    return this.afs.collection<Zone>('zones', ref => ref.orderBy("nom")).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Zone;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getZones(): Observable<Zone[]> {
    return this.http.get(this.url).pipe(map((res: Zone[]) => res));
  }

  getZone(id: string): Observable<Zone> {
    return this.http.get(this.url + id).pipe(map((res: Zone) => res));
  }

  addZone(zone: Zone): Observable<Zone> {
    return this.http.post(this.url, zone.saveState()).pipe(map((res: Zone) => res));
  }

  updateZone(zone: Zone): Observable<Zone> {
    return this.http.put(this.url, { id: zone.id, data: zone.saveState() }).pipe(map((res: Zone) => res));
  }

  deleteZone(id: string): Observable<boolean> {
    return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(map((res: boolean) => res));
  }

}