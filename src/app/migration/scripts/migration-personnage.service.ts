import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';

import { Personnage } from '../../services/personnages/models/personnage';
import { IPersonnage } from '../models/personnage';
import { Alignement } from '../models/alignement';

@Injectable()
export class MigrationPersonnageService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public async migratePersonnage(id: string): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      try {

        const migratedPersonnage = {} as IPersonnage;

        const personnage = await this.afs.doc<Personnage>(`personnages/${id}`).valueChanges().pipe(first()).toPromise();
        
        // Default Properties
        migratedPersonnage.id = id;
        migratedPersonnage.nom = personnage.nom;
        migratedPersonnage.userRef = personnage.userRef;
        migratedPersonnage.vies = personnage.vie || 5;
        migratedPersonnage.gnEffectif = personnage.gnEffectif || 0;
        migratedPersonnage.niveauReel = personnage.niveauReel || 0;
        migratedPersonnage.niveauDisponible = personnage.niveauDisponible || 0;
        
        
        // Enum Refs
        personnage.alignementRef = (await this.migrateAlignement(personnage.alignementRef)).nom;

        // ...
        // Save Personnage

        console.log(migratedPersonnage);

        resolve(true);

      } catch (error) {
        reject(error);
      }

    });

  }

  private async migrateAlignement(alignementId: string): Promise<any> {
    return await this.afs.doc<any>(`alignements/${alignementId}`).valueChanges().pipe(first()).toPromise();
  }

}