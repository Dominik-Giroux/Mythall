import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Alignement } from '../models/alignement';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AlignementService {

    constructor(
        private http: HttpClient,
        private afs: AngularFirestore
    ) { }

    private url = environment.api + 'alignements/';

    getAlignements$(): Observable<Alignement[]> {
        return this.afs.collection<Alignement>('alignements').snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Alignement;
                    data.id = a.payload.doc.id;
                    return data;
                });
            })
        )
    }

    getAlignements(): Observable<Alignement[]> {
        return this.http.get(this.url).pipe(
            map((res: Alignement[]) => res)
        )
    }

    getAlignement(id: string): Observable<Alignement> {
        return this.http.get(this.url + id).pipe(
            map((res: Alignement) => res)
        );
    }

    addAlignement(alignement: Alignement): Observable<Alignement> {
        return this.http.post(this.url, alignement.saveState()).pipe(
            map((res: Alignement) => res)
        );
    }

    updateAlignement(alignement: Alignement): Observable<Alignement> {
        return this.http.put(this.url, { id: alignement.id, data: alignement.saveState() }).pipe(
            map((res: Alignement) => res)
        );
    }

    deleteAlignement(id: string): Observable<boolean> {
        return this.http.delete(this.url, { params: new HttpParams().set('id', id) }).pipe(
            map((res: boolean) => res)
        );
    }

}