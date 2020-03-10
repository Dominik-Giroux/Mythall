import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { EcoleService } from '../ecole.service';
import { PorteService } from '../porte.service';
import { DureeService } from '../duree.service';
import { ZoneService } from '../zone.service';
import { Sort } from './models/sort';
import { Ecole } from '../../models/ecole';
import { Porte } from '../../models/porte';
import { Duree } from '../../models/duree';
import { Zone } from '../../models/zone';
import { tap, flatMap, map, first } from 'rxjs/operators';

@Injectable()
export class SortService {

  constructor(
    private db: FirestoreService,
    private ecoleService: EcoleService,
    private porteService: PorteService,
    private dureeService: DureeService,
    private zoneService: ZoneService
  ) { }

  getSorts(): Observable<Sort[]> {
    return this.db.colWithIds$('sorts', ref => ref.orderBy("nom")).pipe(
      tap(results => {
        results.sort((a: Sort, b: Sort) => {
          return a.nom.localeCompare(b.nom);
        })
      })
    );
  }

  getSort(id: string): Observable<Sort> {
    return this.db.doc$('sorts/' + id).pipe(
      flatMap((sort: Sort) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(sort));

        this.getEcole(sort, observableBatch);
        this.getPorte(sort, observableBatch);
        this.getDuree(sort, observableBatch);
        this.getZone(sort, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
            let sort: Sort = this.map(data[0]);
            return sort;
          })
        )

      })
    ) as Observable<Sort>
  }

  addSort(sort: Sort) {
    return this.db.add('sorts', sort, sort.nom);
  }

  updateSort(id: string, sort: Sort) {
    return this.db.update('sorts/' + id, sort, sort.nom);
  }

  deleteSort(sort: Sort) {
    return this.db.delete('sorts/' + sort.id, sort.nom);
  }

  //#region Maps
  map(data: Sort): Sort {
    var sort: Sort = new Sort();
    for (var key in data) {
      sort[key] = data[key]
    }
    //this.stateChange(sort);
    return sort;
  }

  mapSummary(data: Sort): Sort {
    var sort: Sort = new Sort();
    for (var key in data) {
      sort[key] = data[key]
    }
    this.stateChange(sort);
    return sort;
  }

  //#endregion

  //#region Private Methods
  private stateChange(sort: Sort) {

    //Ecole
    this.ecoleService.getEcole(sort.ecoleRef).subscribe(res => {
      sort.ecole = res;
    });

    //Porte
    this.porteService.getPorte(sort.porteRef).subscribe(res => {
      sort.porte = res;
    });

    //Duree
    this.dureeService.getDuree(sort.dureeRef).subscribe(res => {
      sort.duree = res;
    });

    //Zone
    this.zoneService.getZone(sort.zoneRef).subscribe(res => {
      sort.zone = res;
    });

  }

  private getEcole(sort: Sort, observableBatch: any[]) {
    if (sort.ecoleRef) {
      observableBatch.push(this.ecoleService.getEcole(sort.ecoleRef).pipe(
        map((ecole: Ecole) => {
          sort.ecole = ecole;
        }),
        first()
      ))
    }
  }

  private getPorte(sort: Sort, observableBatch: any[]) {
    if (sort.porteRef) {
      observableBatch.push(this.porteService.getPorte(sort.porteRef).pipe(
        map((porte: Porte) => {
          sort.porte = porte;
        }),
        first()
      ))
    }
  }

  private getDuree(sort: Sort, observableBatch: any[]) {
    if (sort.dureeRef) {
      observableBatch.push(this.dureeService.getDuree(sort.dureeRef).pipe(
        map((duree: Duree) => {
          sort.duree = duree;
        }),
        first()
      ))
    }
  }

  private getZone(sort: Sort, observableBatch: any[]) {
    if (sort.zoneRef) {
      observableBatch.push(this.zoneService.getZone(sort.zoneRef).pipe(
        map((zone: Zone) => {
          sort.zone = zone;
        }),
        first()
      ))
    }
  }

  //#endregion

}