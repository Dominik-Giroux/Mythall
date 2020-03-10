import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { mergeMap, map, tap, first } from 'rxjs/operators';
import { FirestoreService } from '../firestore/firestore.service';
import { Classe } from './models/classe';
import { Aptitude } from '../aptitudes/models/aptitude';
import { Don } from '../dons/models/don';
import { Sort } from '../sorts/models/sort';
import { AptitudeService } from '../aptitudes/aptitude.service';
import { SortService } from '../sorts/sort.service';
import { ImmuniteService } from '../immunite.service';
import { ResistanceService } from '../resistance.service';
import { StatistiqueService } from '../statistique.service';
import { Resistance } from '../../models/resistance';
import { Statistique } from '../../models/statistique';
import { Immunite } from '../../models/immunite';

@Injectable()
export class ClasseService {

  constructor(
    private db: FirestoreService,
    private aptitudeService: AptitudeService,
    private sortService: SortService,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService,
  ) { }

  getClasses(): Observable<Classe[]> {
	return this.db.colWithIds$('classes', ref => ref.orderBy("nom")).pipe(
		tap(results => {
			results.sort((a: Classe, b: Classe) => {
				return a.nom.localeCompare(b.nom);
			})
		})
	);
  }

  getClasse(id: string): Observable<Classe> {
    return this.db.doc$('classes/' + id).pipe(
      mergeMap((classe: Classe) => {

        let observableBatch: Observable<any>[] = [];
        observableBatch.push(of(classe));

        this.getMulticlassement(classe, observableBatch);
        this.getAptitudees(classe, observableBatch);
        this.getSorts(classe, observableBatch);
        this.getDons(classe, observableBatch);
        this.getResistances(classe, observableBatch);
        this.getStatistiques(classe, observableBatch);
        this.getImmunites(classe, observableBatch);

        return forkJoin(observableBatch).pipe(
          map((data: any[]) => {
           let classe: Classe = this.map(data[0]);
           return classe;
          })
        )

      })
    ) as Observable<Classe>
  }

  addClasse(classe: Classe) {
    return this.db.add('classes', classe, classe.nom);
  }

  updateClasse(id: string, classe: Classe) {
    return this.db.update('classes/' + id, classe, classe.nom);
  }

  deleteClasse(classe: Classe) {
    return this.db.delete('classes/' + classe.id, classe.nom);
  }

  getClasseSummary(id: string): Observable<Classe> {
    return this.db.doc$('classes/' + id);
  }

  getClassesStandard(): Observable<Classe[]> {
    return this.db.colWithIds$('classes', ref => ref.where('prestige', '==', false).orderBy("nom"))
    // .map((classes: Classe[]) => {
    //   classes.forEach(classe => {
    //     classe.multiclassementRef.forEach(multiRef => {
    //       this.getClasseSummary(multiRef).subscribe(multi => {
    //         classe.multiclassement.push(multi);
    //       });
    //     });
    //   });
    //   return classes;
    // });
  }

  getClassesPrestige(): Observable<Classe[]> {
	return this.db.colWithIds$('classes', ref => ref.where('prestige', '==', true).orderBy("nom")).pipe(
		tap(results => {
			results.sort((a: Classe, b: Classe) => {
				return a.nom.localeCompare(b.nom);
			})
		})
	);
  }

  //#region Maps
  map(data: Classe): Classe {
    var classe: Classe = new Classe();
    for (var key in data) {
      classe[key] = data[key]
    }
    return classe;
  }
  //#endregion

  //#region Private Methods

  private getMulticlassement(classe: Classe, observableBatch: any[]) {
    if (classe.multiclassementRef) {
      classe.multiclassementRef.forEach(classeRef => {
        observableBatch.push(this.getClasseSummary(classeRef).pipe(
          map((classe: Classe) => {
          if (!classe.multiclassement) classe.multiclassement = [];
          classe.multiclassement.push(classe);
          }),
          first()
        ))
      });
    }
  }

  private getAptitudees(classe: Classe, observableBatch: any[]) {
    if (classe.aptitudes && classe.aptitudes.length > 0) {
      classe.aptitudes.forEach(aptitudeItem => {
        observableBatch.push(this.aptitudeService.getAptitude(aptitudeItem.aptitudeRef).pipe(
        map((aptitude: Aptitude) => {
          aptitudeItem.aptitude = aptitude;
        }),
        first()
        ))
      });
    }
  }

  private getDons(classe: Classe, observableBatch: any[]) {
    if (classe.dons && classe.dons.length > 0) {
      classe.dons.forEach(donItem => {
        observableBatch.push(this.db.doc$('dons/' + donItem.donRef).pipe(
          map((don: Don) => {
            donItem.don = don;
          }),
          first()
        ))
      });
    }
  }

  private getSorts(classe: Classe, observableBatch: any[]) {
    if (classe.sorts && classe.sorts.length > 0) {
      classe.sorts.forEach(sortItem => {
        observableBatch.push(this.sortService.getSort(sortItem.sortRef).pipe(
          map((sort: Sort) => {
            sortItem.sort = sort;
          }),
          first()
        ))
      });
    }
  }

  private getResistances(classe: Classe, observableBatch: any[]) {
    if (classe.resistances && classe.resistances.length > 0) {
      classe.resistances.forEach(resistanceItem => {
        observableBatch.push(this.resistanceService.getResistance(resistanceItem.resistanceRef).pipe(
          map((resistance: Resistance) => {
          resistanceItem.resistance = resistance;
        }),
        first()
        ))
      });
    }
  }

  private getStatistiques(classe: Classe, observableBatch: any[]) {
    if (classe.statistiques && classe.statistiques.length > 0) {
      classe.statistiques.forEach(statistiqueItem => {
        observableBatch.push(this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef).pipe(
          map((statistique: Statistique) => {
          statistiqueItem.statistique = statistique;
        }),first()
        ))
      });
    }
  }

  private getImmunites(classe: Classe, observableBatch: any[]) {
    if (classe.immunitesRef) {
      classe.immunitesRef.forEach(immuniteRef => {
        observableBatch.push(this.immuniteService.getImmunite(immuniteRef).pipe(
          map((immunite: Immunite) => {
          if (!classe.immunites) classe.immunites = [];
          classe.immunites.push(immunite);
        }),
        first()
        ))
      });
    }
  }

  //#endregion

}