import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPersonnage } from './personnage.service';

export interface IResistance extends IResistanceDB {
  id: string;
}

export interface IResistanceDB {
  nom: string;
}

export class ResistanceItem {

  constructor() {
    this.resistance = null;
    this.resistanceRef = '';
    this.niveau = 1;
    this.valeur = 0;
    this.cummulable = false;
  }

  resistance: IResistance;
  resistanceRef: string;
  niveau: number;
  valeur: number;
  cummulable: boolean;
}


export class ResistanceValue {

  constructor() {
    this.resistance = null;
    this.valeur = 0;
  }

  resistance: IResistance;
  valeur: number;
}

@Injectable()
export class ResistanceService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public async getResistances(): Promise<IResistance[]> {
    return (await this.afs.collection<IResistance>('resistances').ref.orderBy('nom').get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IResistance;
      });
  }

  public async getResistance(id: string): Promise<IResistance> {
    const data = await this.afs.doc<IResistance>(`resistances/${id}`).ref.get();
    return {
      id: data.id,
      ...data.data()
    } as IResistance;
  }

  public async addResistance(resistance: IResistance): Promise<IResistance> {
    const data = await this.afs.collection(`resistances`).add(this._saveState(resistance));
    return { id: data.id, ...resistance } as IResistance;
  }

  public async updateResistance(resistance: IResistance): Promise<IResistance> {
    await this.afs.doc<IResistance>(`resistances/${resistance.id}`).update(this._saveState(resistance));
    return resistance;
  }

  public async deleteResistance(id: string): Promise<boolean> {
    await this.afs.doc<IResistance>(`resistances/${id}`).delete();
    return true;
  }

  public async getPersonnageResistances(personnage: IPersonnage): Promise<IPersonnage> {

    //Race Resistances
    if (personnage.race.resistances) {

      personnage.race.resistances.forEach(resistanceItem => {

        let found: boolean = false;

        if (personnage.resistances && personnage.resistances.length > 0) {
          personnage.resistances.forEach(personnageResistanceItem => {
            if (resistanceItem.resistanceRef == personnageResistanceItem.resistance.id && personnage.niveauReel >= resistanceItem.niveau) {

              //Cummulable l'ajoute à la valeur
              if (resistanceItem.cummulable) {
                personnageResistanceItem.valeur += resistanceItem.valeur;
              }

              //Non Cummulable prend la plus forte des deux
              if (!resistanceItem.cummulable) {
                personnageResistanceItem.valeur = Math.max(personnageResistanceItem.valeur, resistanceItem.valeur);
              }

              found = true;
            }
          })
        }

        if (!found && personnage.niveauReel >= resistanceItem.niveau) {

          if (!personnage.resistances) {
            personnage.resistances = [];
          }

          let resistance: ResistanceValue = new ResistanceValue();
          resistance.resistance = resistanceItem.resistance;
          resistance.valeur = resistanceItem.valeur;
          personnage.resistances.push(resistance);

        }

      })
    }

    //Classe Resistances
    if (personnage.classes && personnage.classes.length > 0) {
      personnage.classes.forEach(classeItem => {

        if (classeItem.classe && classeItem.classe.resistances) {
          classeItem.classe.resistances.forEach(resistanceItem => {

            let found: boolean = false;

            if (personnage.resistances) {
              personnage.resistances.forEach(personnageResistanceItem => {
                if (resistanceItem.resistanceRef == personnageResistanceItem.resistance.id && classeItem.niveau >= resistanceItem.niveau) {

                  //Cummulable l'ajoute à la valeur
                  if (resistanceItem.cummulable) {
                    personnageResistanceItem.valeur += resistanceItem.valeur;
                  }

                  //Non Cummulable prend la plus forte des deux
                  if (!resistanceItem.cummulable) {
                    personnageResistanceItem.valeur = Math.max(personnageResistanceItem.valeur, resistanceItem.valeur);
                  }

                  found = true;
                }
              })
            }

            if (!found && personnage.niveauReel >= resistanceItem.niveau) {

              if (!personnage.resistances) {
                personnage.resistances = [];
              }

              let resistance: ResistanceValue = new ResistanceValue();
              resistance.resistance = resistanceItem.resistance;
              resistance.valeur = resistanceItem.valeur;
              personnage.resistances.push(resistance);

            }

          })
        }

      })

    }

    //Aptitude Resistances
    if (personnage.aptitudes) {

      personnage.aptitudes.forEach(aptitudeItem => {
        aptitudeItem.aptitude.resistances.forEach(aptitudeResistanceItem => {

          let found: boolean = false;

          if (personnage.resistances) {
            personnage.resistances.forEach(personnageResistanceItem => {

              if (aptitudeResistanceItem.resistanceRef == personnageResistanceItem.resistance.id) {

                //Cummulable l'ajoute à la valeur
                if (aptitudeResistanceItem.cummulable) {
                  personnageResistanceItem.valeur += aptitudeResistanceItem.valeur;
                }

                //Non Cummulable prend la plus forte des deux
                if (!aptitudeResistanceItem.cummulable) {
                  personnageResistanceItem.valeur = Math.max(personnageResistanceItem.valeur, aptitudeResistanceItem.valeur);
                }

                found = true;
              }
            })
          }

          if (!found) {

            if (!personnage.resistances) {
              personnage.resistances = [];
            }

            let resistance: ResistanceValue = new ResistanceValue();
            resistance.resistance = aptitudeResistanceItem.resistance;
            resistance.valeur = aptitudeResistanceItem.valeur;
            personnage.resistances.push(resistance);

          }

        })

      })
    }

    //Don Resistances
    if (personnage.dons) {

      personnage.dons.forEach(donItem => {
        donItem.don.resistances.forEach(donResistanceItem => {

          let found: boolean = false;

          if (personnage.resistances) {
            personnage.resistances.forEach(personnageResistanceItem => {

              if (donResistanceItem.resistanceRef == personnageResistanceItem.resistance.id) {

                //Cummulable l'ajoute à la valeur
                if (donResistanceItem.cummulable) {
                  personnageResistanceItem.valeur += donResistanceItem.valeur;
                }

                //Non Cummulable prend la plus forte des deux
                if (!donResistanceItem.cummulable) {
                  personnageResistanceItem.valeur = Math.max(personnageResistanceItem.valeur, donResistanceItem.valeur);
                }

                found = true;
              }
            })
          }

          if (!found) {

            if (!personnage.resistances) {
              personnage.resistances = [];
            }

            let resistance: ResistanceValue = new ResistanceValue();
            resistance.resistance = donResistanceItem.resistance;
            resistance.valeur = donResistanceItem.valeur;
            personnage.resistances.push(resistance);

          }

        })

      })
    }

    return personnage;

  }

  private _saveState(item: IResistance): IResistanceDB {
    return {
      nom: item.nom,
    };
  }

}