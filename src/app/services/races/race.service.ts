import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { ImmuniteService } from '../immunite.service';
import { ResistanceService } from '../resistance.service';
import { StatistiqueService } from '../statistique.service';
import { SortService } from '../sorts/sort.service';
import { Race } from './models/race';
import { Resistance } from '../../models/resistance';
import { Classe } from '../classes/models/classe';
import { Don } from '../dons/models/don';
import { Immunite } from '../../models/immunite';
import { Sort } from '../sorts/models/sort';
import { Statistique } from '../../models/statistique';
import { tap, map, mergeMap, flatMap, first } from 'rxjs/operators';

@Injectable()
export class RaceService {

  constructor(
    private db: FirestoreService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
    private sortService: SortService
  ) { }

  getRaces(): Observable<Race[]> {

    let races: Observable<Race[]> = this.db.colWithIds$('races', ref => ref.orderBy("nom")).pipe(
      tap(results => {
        results.sort((a: Race, b: Race) => {
          return a.nom.localeCompare(b.nom);
        })
      })).pipe(
        mergeMap((races: Race[]) => {

          races.forEach(race => {

            let observableBatch: Observable<any>[] = [];
            observableBatch.push(of(race));

            this.getClasses(race, observableBatch);

            forkJoin(observableBatch).pipe(
              map((data: any[]) => {
                let race: Race = this.map(data[0]);
                return race;
              })
            ).subscribe();

          })

          return of(races);

        })
      )

    return races;

  }

  getRacesSummary(): Observable<Race[]> {
    return this.db.colWithIds$('races', ref => ref.orderBy("nom"));
  }

  getRace(id: string): Observable<Race> {
    return this.db.doc$('races/' + id).pipe(
      flatMap((race: Race) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(race));

        this.getClasses(race, observableBatch);
        this.getResistances(race, observableBatch);
        this.getStatistiques(race, observableBatch);
        this.getImmunites(race, observableBatch);
        this.getSortsRaciaux(race, observableBatch);
        this.getDonsRaciaux(race, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let race: Race = this.map(data[0]);
            return race;
          })
        )

      })
    )
  }

  getRaceSummary(id: string): Observable<Race> {
    return this.db.doc$('races/' + id);
  }

  addRace(race: Race) {
    return this.db.add('races', race, race.nom);
  }

  updateRace(id: string, race: Race) {
    return this.db.update('races/' + id, race, race.nom);
  }

  deleteRace(race: Race) {
    return this.db.delete('races/' + race.id, race.nom);
  }

  map(data: Race): Race {
    var race: Race = new Race();
    for (var key in data) {
      race[key] = data[key]
    }
    return race;
  }

  //#region Fetch Data

  private getClasses(race: Race, observableBatch: any[]) {
    if (race.classesDisponibleRef) {
      race.classesDisponibleRef.forEach(classeRef => {
        observableBatch.push(this.db.doc$('classes/' + classeRef).pipe(
          map((classe: Classe) => {
            if (!race.classesDisponible) race.classesDisponible = [];
            race.classesDisponible.push(classe);
          }),
          first()
        ))
      });
    }
  }

  private getResistances(race: Race, observableBatch: any[]) {
    if (race.resistances && race.resistances.length > 0) {
      race.resistances.forEach(resistanceItem => {
        observableBatch.push(this.resistanceService.getResistance(resistanceItem.resistanceRef).pipe(
          map((resistance: Resistance) => {
            resistanceItem.resistance = resistance;
          }),
          first()
        ))
      });
    }
  }

  private getStatistiques(race: Race, observableBatch: any[]) {
    if (race.statistiques && race.statistiques.length > 0) {
      race.statistiques.forEach(statistiqueItem => {
        observableBatch.push(this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef).pipe(
          map((statistique: Statistique) => {
            statistiqueItem.statistique = statistique;
          }),
          first()
        ))
      });
    }
  }

  private getImmunites(race: Race, observableBatch: any[]) {
    if (race.immunitesRef) {
      race.immunitesRef.forEach(immuniteRef => {
        observableBatch.push(this.immuniteService.getImmunite(immuniteRef).pipe(
          map((immunite: Immunite) => {
            if (!race.immunites) race.immunites = [];
            race.immunites.push(immunite);
          }),
          first()
        ))
      });
    }
  }

  private getSortsRaciaux(race: Race, observableBatch: any[]) {
    if (race.sortsRacialRef) {
      race.sortsRacialRef.forEach(sortRaciauxRef => {
        observableBatch.push(this.sortService.getSort(sortRaciauxRef).pipe(
          map((sort: Sort) => {
            if (!race.sortsRacial) race.sortsRacial = [];
            race.sortsRacial.push(sort);
          }), first()
        ))
      });
    }
  }

  private getDonsRaciaux(race: Race, observableBatch: any[]) {
    if (race.donsRacialRef) {
      race.donsRacialRef.forEach(donRaciauxRef => {
        observableBatch.push(this.db.doc$('dons/' + donRaciauxRef).pipe(
          map((don: Don) => {
            if (!race.donsRacial) race.donsRacial = [];
            race.donsRacial.push(don);
          }),
          first()
        ))
      });
    }
  }

  //#endregion

}