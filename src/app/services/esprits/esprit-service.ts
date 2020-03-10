import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap, first } from 'rxjs/operators';
import { FirestoreService } from '../firestore/firestore.service';
import { AptitudeService } from '../aptitudes/aptitude.service';
import { DonService } from '../dons/don.service';
import { SortService } from '../sorts/sort.service';
import { Aptitude } from '../aptitudes/models/aptitude';
import { Don } from '../dons/models/don';
import { Esprit } from './models/esprit';
import { Sort } from '../sorts/models/sort';

@Injectable()
export class EspritService {

  constructor(
    private db: FirestoreService,
    private aptitudeService: AptitudeService,
    private donService: DonService,
    private sortService: SortService
  ) { }

  getEsprits(): Observable<Esprit[]> {
    return this.db.colWithIds$('esprits', ref => ref.orderBy("nom"));
  }

  getEsprit(id: string): Observable<Esprit> {
    return this.db.doc$('esprits/' + id).pipe(
      flatMap((esprit: Esprit) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(esprit));

        this.getAptitudees(esprit, observableBatch);
        this.getSorts(esprit, observableBatch);
        this.getDons(esprit, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let esprit: Esprit = this.map(data[0]);
            return esprit;
          })
        )

      })
    ) as Observable<Esprit>
  }

  addEsprit(esprit: Esprit) {
    return this.db.add('esprits', esprit, esprit.nom);
  }

  updateEsprit(id: string, esprit: Esprit) {
    return this.db.update('esprits/' + id, esprit, esprit.nom);
  }

  deleteEsprit(esprit: Esprit) {
    return this.db.delete('esprits/' + esprit.id, esprit.nom);
  }


  //#region Maps
  map(data: Esprit): Esprit {
    var esprit: Esprit = new Esprit();
    for (var key in data) {
      esprit[key] = data[key]
    }
    return esprit;
  }

  //#endregion

  //#region Private Methods
  private getAptitudees(esprit: Esprit, observableBatch: any[]) {
    if (esprit.aptitudes && esprit.aptitudes.length > 0) {
      esprit.aptitudes.forEach(aptitudeItem => {
        observableBatch.push(this.aptitudeService.getAptitude(aptitudeItem.aptitudeRef).pipe(
          map((aptitude: Aptitude) => {
            aptitudeItem.aptitude = aptitude;
          }),
          first()
        ))
      });
    }
  }

  private getDons(esprit: Esprit, observableBatch: any[]) {
    if (esprit.dons && esprit.dons.length > 0) {
      esprit.dons.forEach(donItem => {
        observableBatch.push(this.donService.getDon(donItem.donRef).pipe(
          map((don: Don) => {
            donItem.don = don;
          }),
          first()
        ))
      });
    }
  }

  private getSorts(esprit: Esprit, observableBatch: any[]) {
    if (esprit.sorts && esprit.sorts.length > 0) {
      esprit.sorts.forEach(sortItem => {
        observableBatch.push(this.sortService.getSort(sortItem.sortRef).pipe(
          map((sort: Sort) => {
            sortItem.sort = sort;
          }),
          first()
        ))
      });
    }
  }
  //#endregion

}