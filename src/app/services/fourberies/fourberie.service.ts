import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap, first } from 'rxjs/operators';
import { FirestoreService } from '../firestore/firestore.service';
import { StatistiqueService } from '../statistique.service';
import { Fourberie } from './models/fourberie';
import { Statistique } from '../../models/statistique';

@Injectable()
export class FourberieService {

  constructor(
    private db: FirestoreService,
    private statistiqueService: StatistiqueService,
  ) { }

  getFourberies(): Observable<Fourberie[]> {
    return this.db.colWithIds$('fourberies', ref => ref.orderBy("nom"));
  }

  getFourberie(id: string): Observable<Fourberie> {
    return this.db.doc$('fourberies/' + id).pipe(
      flatMap((fourberie: Fourberie) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(fourberie));

        this.getFourberiesRequis(fourberie, observableBatch);
        this.getModificateur(fourberie, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let fourberie: Fourberie = this.map(data[0]);
            return fourberie;
          })
        )

      })
    ) as Observable<Fourberie>
  }

  getFourberieFiche(id: string): Observable<Fourberie> {
    return this.db.doc$('fourberies/' + id).pipe(
      flatMap((fourberie: Fourberie) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(fourberie));

        this.getModificateur(fourberie, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let fourberie: Fourberie = this.map(data[0]);
            return fourberie;
          })
        )

      })
    ) as Observable<Fourberie>
  }

  addFourberie(fourberie: Fourberie) {
    return this.db.add('fourberies', fourberie, fourberie.nom);
  }

  updateFourberie(id: string, fourberie: Fourberie) {
    return this.db.update('fourberies/' + id, fourberie, fourberie.nom);
  }

  deleteFourberie(fourberie: Fourberie) {
    return this.db.delete('fourberies/' + fourberie.id, fourberie.nom);
  }

  //#region Maps
  map(data: Fourberie): Fourberie {
    var fourberie: Fourberie = new Fourberie();
    for (var key in data) {
      fourberie[key] = data[key]
    }
    return fourberie;
  }

  //#endregion

  //#region Private Methods
  private getFourberiesRequis(fourberie: Fourberie, observableBatch: any[]) {
    if (fourberie.fourberiesRequisRef) {
      fourberie.fourberiesRequisRef.forEach(fourberieRequisRef => {
        observableBatch.push(this.getFourberie(fourberieRequisRef).pipe(
          map((fourberie: Fourberie) => {
            if (!fourberie.fourberiesRequis) fourberie.fourberiesRequis = [];
            fourberie.fourberiesRequis.push(fourberie);
          }),
          first(
          )
        ))
      });
    }
  }

  private getModificateur(fourberie: Fourberie, observableBatch: any[]) {
    if (fourberie.modificateurRef) {
      observableBatch.push(this.statistiqueService.getStatistique(fourberie.modificateurRef).pipe(
        map((statistique: Statistique) => {
          fourberie.modificateur = statistique;
        }),
        first()
      ))
    }
  }
  //#endregion

}