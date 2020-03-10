import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { ImmuniteService } from '../immunite.service';
import { ResistanceService } from '../resistance.service';
import { StatistiqueService } from '../statistique.service';
import { Classe } from '../classes/models/classe';
import { Don } from './models/don';
import { Immunite } from '../../models/immunite';
import { Race } from '../races/models/race';
import { Resistance } from '../../models/resistance';
import { Statistique } from '../../models/statistique';
import { tap, map, flatMap, first } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable()
export class DonService {

  constructor(
    private db: FirestoreService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService
  ) { }

  getDons(): Observable<Don[]> {
    return this.db.colWithIds$('dons', ref => ref.orderBy("nom")).pipe(
      tap(results => {
        results.sort((a: Don, b: Don) => {
          return a.nom.localeCompare(b.nom);
        })
      })
    );
  }

  getDon(id: string): Observable<Don> {
    return this.db.doc$('dons/' + id).pipe(
      flatMap((don: Don) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(don));

        this.getClassesAuthorise(don, observableBatch);
        this.getDonsRequis(don, observableBatch);
        this.getImmunites(don, observableBatch);
        this.getRaces(don, observableBatch);
        this.getResistances(don, observableBatch);
        this.getStatistiques(don, observableBatch);
        this.getModificateur(don, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let don: Don = this.map(data[0]);
            return don;
          })
        )

      })
    ) as Observable<Don>
  }

  addDon(don: Don) {
    return this.db.add('dons', don, don.nom);
  }

  updateDon(id: string, don: Don) {
    return this.db.update('dons/' + id, don, don.nom);
  }

  deleteDon(don: Don) {
    return this.db.delete('dons/' + don.id, don.nom);
  }

  getDonSummary(id: string): Observable<Don> {
    return this.db.doc$('dons/' + id);
  }

  getDonsByCategorie(type: string): Promise<Don[]> {
    return new Promise((resolve, reject) => {
      firebase.app().firestore().collection('dons').where('categorie', '==', type).get().then(querySnapshot => {
        let result: any[] = [];
        querySnapshot.forEach(function (doc) {
          const data: any = doc.data();
          data.id = doc.id;
          result.push(data);
        });
        resolve(result);
      }).catch(error => reject(error));
    });
  }

  getDonFiche(id: string): Observable<Don> {
    return this.db.doc$('dons/' + id).pipe(
      flatMap((don: Don) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(don));

        this.getImmunites(don, observableBatch);
        this.getResistances(don, observableBatch);
        this.getStatistiques(don, observableBatch);
        this.getModificateur(don, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let don: Don = this.map(data[0]);
            return don;
          })
        )

      })
    ) as Observable<Don>
  }

  //#region Maps
  map(data: Don): Don {
    var don: Don = new Don();
    for (var key in data) {
      don[key] = data[key]
    }
    return don;
  }

  //#endregion

  //#region Private Methods
  private getClassesAuthorise(don: Don, observableBatch: any[]) {
    if (don.classesAutorise && don.classesAutorise.length > 0) {
      don.classesAutorise.forEach(classeAuthorise => {
        observableBatch.push(this.db.doc$('classes/' + classeAuthorise.classeRef).pipe(
          map((classe: Classe) => {
            classeAuthorise.classe = classe;
          }), first()
        ))
      });
    }
  }

  private getDonsRequis(don: Don, observableBatch: any[]) {
    if (don.donsRequisRef) {
      don.donsRequisRef.forEach(donRequisRef => {
        observableBatch.push(this.getDon(donRequisRef).pipe(
          map((don: Don) => {
            if (!don.donsRequis) don.donsRequis = [];
            don.donsRequis.push(don);
          }), first()
        ))
      });
    }
  }

  private getImmunites(don: Don, observableBatch: any[]) {
    if (don.immunitesRef) {
      don.immunitesRef.forEach(immuniteRef => {
        observableBatch.push(this.immuniteService.getImmunite(immuniteRef).pipe(
          map((immunite: Immunite) => {
            if (!don.immunites) don.immunites = [];
            don.immunites.push(immunite);
          }),
          first()
        ))
      });
    }
  }

  private getRaces(don: Don, observableBatch: any[]) {
    if (don.racesAutoriseRef) {
      don.racesAutoriseRef.forEach(raceRef => {
        observableBatch.push(this.db.doc$('races/' + raceRef).pipe(
          map((race: Race) => {
            if (!don.racesAutorise) don.racesAutorise = [];
            don.racesAutorise.push(race);
          }),
          first()
        ))
      });
    }
  }

  private getResistances(don: Don, observableBatch: any[]) {
    if (don.resistances && don.resistances.length > 0) {
      don.resistances.forEach(resistanceItem => {
        observableBatch.push(this.resistanceService.getResistance(resistanceItem.resistanceRef).pipe(
          map((resistance: Resistance) => {
            resistanceItem.resistance = resistance;
          }),
          first()
        ))
      });
    }
  }

  private getStatistiques(don: Don, observableBatch: any[]) {
    if (don.statistiques && don.statistiques.length > 0) {
      don.statistiques.forEach(statistiqueItem => {
        observableBatch.push(this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef).pipe(
          map((statistique: Statistique) => {
            statistiqueItem.statistique = statistique;
          }),
          first()
        ))
      });
    }
  }

  private getModificateur(don: Don, observableBatch: any[]) {
    if (don.modificateursRef && don.modificateursRef.length > 0) {
      don.modificateursRef.forEach(modificateurRef => {
        observableBatch.push(this.statistiqueService.getStatistique(modificateurRef).pipe(
          map((statistique: Statistique) => {
            if (!don.modificateurs) don.modificateurs = [];
            don.modificateurs.push(statistique);
          }),
          first()
        ))
      });
    }
  }

  //#endregion

}