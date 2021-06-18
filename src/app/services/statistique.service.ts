import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPersonnage } from './personnage.service';

export interface IStatistique extends IStatistiqueDB {
  id: string;
}

export interface IStatistiqueDB {
  nom: string;
}

export class StatistiqueItem {

  constructor() {
    this.statistique = null;
    this.statistiqueRef = '';
    this.niveau = 1;
    this.valeur = 0;
    this.cummulable = false;
  }

  statistique: IStatistique;
  statistiqueRef: string;
  niveau: number;
  valeur: number;
  cummulable: boolean;
}

export class StatistiqueValue {

  constructor() {
    this.statistique = null;
    this.valeur = 0;
  }

  statistique: IStatistique;
  valeur: number;
}

export enum StatistiqueIds {
  Constitution = 'OdzM6YHkYw41HXMIcTsw',
  Dextérité = 'oFeJq3NgdDDEwi0Y1rdR',
  Force = 'gOg0TFSbU8mvlv8baCXE',
  Intelligence = 'yKfNuFBQY5UknrTNOxpA',
  Sagesse = 'HkaChqWpHOlINdla02ja',
  PVTorse = 'sCcNIQDoWKUIIcSpkB2m',
  PVBras = 'ZSnV9s6cyzYihdFR6wfr',
  PVJambes = '69jKTq64XUCk51EmY0Z1',
  Lutte = 'Rp8BG8OtlNKl8aeuojdi',
  Mana = '3f75skgSz3CWqdERXcqG',
  Ki = 'py44fmGyDCUnkkBZmto9'
}

@Injectable()
export class StatistiqueService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public async getStatistiques(): Promise<IStatistique[]> {
    return (await this.afs.collection<IStatistique>('statistiques').ref.orderBy('nom').get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IStatistique;
      });
  }

  public async getStatistique(id: string): Promise<IStatistique> {
    const data = await this.afs.doc<IStatistique>(`statistiques/${id}`).ref.get();
    return {
      id: data.id,
      ...data.data()
    } as IStatistique;
  }

  public async addStatistique(statistique: IStatistique): Promise<IStatistique> {
    const data = await this.afs.collection(`statistiques`).add(this._saveState(statistique));
    return { id: data.id, ...statistique } as IStatistique;
  }

  public async updateStatistique(statistique: IStatistique): Promise<IStatistique> {
    await this.afs.doc<IStatistique>(`statistiques/${statistique.id}`).update(this._saveState(statistique));
    return statistique;
  }

  public async deleteStatistique(id: string): Promise<boolean> {
    await this.afs.doc<IStatistique>(`statistiques/${id}`).delete();
    return true;
  }

  public async getPersonnageStatistiquesParDefault(personnage: IPersonnage): Promise<IPersonnage> {

    const statistiques = await Promise.all([
      this.getStatistique(StatistiqueIds.Constitution),
      this.getStatistique(StatistiqueIds.Dextérité),
      this.getStatistique(StatistiqueIds.Force),
      this.getStatistique(StatistiqueIds.Intelligence),
      this.getStatistique(StatistiqueIds.Sagesse),
      this.getStatistique(StatistiqueIds.PVTorse),
      this.getStatistique(StatistiqueIds.PVBras),
      this.getStatistique(StatistiqueIds.PVJambes),
      this.getStatistique(StatistiqueIds.Lutte),
      this.getStatistique(StatistiqueIds.Mana),
    ]);

    if (!personnage.statistiques) personnage.statistiques = [];

    // Constitution
    const constitution = new StatistiqueValue();
    constitution.statistique = statistiques[0];
    constitution.valeur = 0;
    personnage.statistiques.push(constitution);

    // Dexterite
    let dexterite = new StatistiqueValue();
    dexterite.statistique = statistiques[1];
    dexterite.valeur = 0;
    personnage.statistiques.push(dexterite);

    // Force
    let force = new StatistiqueValue();
    force.statistique = statistiques[2];
    force.valeur = 0;
    personnage.statistiques.push(force);

    // Intelligence
    let intelligence = new StatistiqueValue();
    intelligence.statistique = statistiques[3];
    intelligence.valeur = 0;
    personnage.statistiques.push(intelligence);

    // Sagesse
    let sagesse = new StatistiqueValue();
    sagesse.statistique = statistiques[4];
    sagesse.valeur = 0;
    personnage.statistiques.push(sagesse);

    // PV Torse
    let pvTorse = new StatistiqueValue();
    pvTorse.statistique = statistiques[5];
    pvTorse.valeur = 3;
    personnage.statistiques.push(pvTorse);

    // PV Bras
    let pvBras = new StatistiqueValue();
    pvBras.statistique = statistiques[6];
    pvBras.valeur = 2;
    personnage.statistiques.push(pvBras);

    // PV Jambes
    let pvJambes = new StatistiqueValue();
    pvJambes.statistique = statistiques[7];
    pvJambes.valeur = 2;
    personnage.statistiques.push(pvJambes);

    // Lutte
    let lutte = new StatistiqueValue();
    lutte.statistique = statistiques[8];
    lutte.valeur = 3;
    personnage.statistiques.push(lutte);

    // Mana
    let mana = new StatistiqueValue();
    mana.statistique = statistiques[9];
    mana.valeur = 0;
    personnage.statistiques.push(mana);

    return personnage;
  }

  public async getPersonnageStatistiques(personnage: IPersonnage): Promise<IPersonnage> {

    //Race Statistiques
    if (personnage?.race?.statistiques?.length) {

      personnage.race.statistiques.forEach(statistiqueItem => {

        let found = false;

        if (personnage.statistiques) {
          personnage.statistiques.forEach(personnageStatistiqueItem => {
            if (statistiqueItem.statistiqueRef == personnageStatistiqueItem.statistique.id && personnage.niveauReel >= statistiqueItem.niveau) {

              //Cummulable l'ajoute à la valeur
              if (statistiqueItem.cummulable) {
                personnageStatistiqueItem.valeur += statistiqueItem.valeur;
              }

              //Non Cummulable prend la plus forte des deux
              if (!statistiqueItem.cummulable) {
                personnageStatistiqueItem.valeur = Math.max(personnageStatistiqueItem.valeur, statistiqueItem.valeur);
              }

              found = true;
            }
          })
        }

        if (!found && personnage.niveauReel >= statistiqueItem.niveau) {
          let statistique: StatistiqueValue = new StatistiqueValue();
          statistique.statistique = statistiqueItem.statistique;
          statistique.valeur = statistiqueItem.valeur;
          personnage.statistiques.push(statistique);
        }

      })
    }

    //Classe Statistiques
    if (personnage?.classes?.length) {
      personnage.classes.forEach(classeItem => {

        if (classeItem?.classe?.statistiques?.length) {
          classeItem.classe.statistiques.forEach(statistiqueItem => {

            let found = false;

            if (personnage?.statistiques?.length) {
              personnage.statistiques.forEach(personnageStatistiqueItem => {
                if (statistiqueItem.statistiqueRef == personnageStatistiqueItem.statistique.id && classeItem.niveau >= statistiqueItem.niveau) {

                  //Cummulable l'ajoute à la valeur
                  if (statistiqueItem.cummulable) {
                    personnageStatistiqueItem.valeur += statistiqueItem.valeur;
                  }

                  //Non Cummulable prend la plus forte des deux
                  if (!statistiqueItem.cummulable) {
                    personnageStatistiqueItem.valeur = Math.max(personnageStatistiqueItem.valeur, statistiqueItem.valeur);
                  }

                  found = true;
                }
              })
            }

            if (!found && personnage.niveauReel >= statistiqueItem.niveau) {
              const statistique = new StatistiqueValue();
              statistique.statistique = statistiqueItem.statistique;
              statistique.valeur = statistiqueItem.valeur;
              personnage.statistiques.push(statistique);
            }

          })
        }

      })

    }

    //Aptitude Statistiques
    if (personnage?.aptitudes?.length) {
      personnage.aptitudes.forEach(aptitudeItem => {
        aptitudeItem.aptitude.statistiques.forEach(aptitudeStatistiqueItem => {
          const personnageStatistiqueItem = personnage.statistiques.find((personnageStatistique) => personnageStatistique.statistique.id === aptitudeStatistiqueItem.statistiqueRef);

          if (personnageStatistiqueItem) {
            // ... Manque potentiellement un attribue de classe dans les aptitutes spéciales pour faire le calcul du niveau selon la classe
            // ... Manque validation du niveau
            if (aptitudeStatistiqueItem.statistiqueRef == personnageStatistiqueItem.statistique.id) {

              //Cummulable l'ajoute à la valeur
              if (aptitudeStatistiqueItem.cummulable) {
                personnageStatistiqueItem.valeur += aptitudeStatistiqueItem.valeur;
              }

              //Non Cummulable prend la plus forte des deux
              if (!aptitudeStatistiqueItem.cummulable) {
                personnageStatistiqueItem.valeur = Math.max(personnageStatistiqueItem.valeur, aptitudeStatistiqueItem.valeur);
              }

            }
          } else {
            const statistique = new StatistiqueValue();
            statistique.statistique = aptitudeStatistiqueItem.statistique;
            statistique.valeur = aptitudeStatistiqueItem.valeur;
            personnage.statistiques.push(statistique);
          }

        })
      })
    }

    //Don Statistiques
    if (personnage?.dons?.length) {

      personnage.dons.forEach(donItem => {
        donItem.don.statistiques.forEach(donStatistiqueItem => {

          let found: boolean = false;

          if (personnage.statistiques) {
            personnage.statistiques.forEach(personnageStatistiqueItem => {

              if (donStatistiqueItem.statistiqueRef == personnageStatistiqueItem.statistique.id) {

                //Cummulable l'ajoute à la valeur
                if (donStatistiqueItem.cummulable) {
                  personnageStatistiqueItem.valeur += donStatistiqueItem.valeur;
                }

                //Non Cummulable prend la plus forte des deux
                if (!donStatistiqueItem.cummulable) {
                  personnageStatistiqueItem.valeur = Math.max(personnageStatistiqueItem.valeur, donStatistiqueItem.valeur);
                }

                found = true;
              }
            })
          }

          if (!found) {

            if (!personnage.statistiques) {
              personnage.statistiques = [];
            }

            let statistique: StatistiqueValue = new StatistiqueValue();
            statistique.statistique = donStatistiqueItem.statistique;
            statistique.valeur = donStatistiqueItem.valeur;
            personnage.statistiques.push(statistique);

          }

        })

      })
    }

    let manaProfane: number = 0;
    let manaDivine: number = 0;

    //Modificateurs
    personnage.statistiques.forEach(statistiqueValue => {

      //Modificateur de Constitution
      if (statistiqueValue.statistique.id == StatistiqueIds.Constitution) {
        personnage.statistiques.forEach(statistiqueValueUpdate => {

          //Modificateur de point de vie
          if (
            statistiqueValueUpdate.statistique.id == StatistiqueIds.PVTorse ||
            statistiqueValueUpdate.statistique.id == StatistiqueIds.PVBras ||
            statistiqueValueUpdate.statistique.id == StatistiqueIds.PVJambes
          ) {
            statistiqueValueUpdate.valeur += statistiqueValue.valeur;
          }

        })
      }

      //Modificateur de Lutte
      if (statistiqueValue.statistique.id == StatistiqueIds.Force || statistiqueValue.statistique.id == StatistiqueIds.Dextérité) { //Force ou Dextérité
        personnage.statistiques.forEach(statistiqueValueUpdate => {

          //Modificateur de Lutte
          if (statistiqueValueUpdate.statistique.id == StatistiqueIds.Lutte) {
            statistiqueValueUpdate.valeur += statistiqueValue.valeur;
          }

        })
      }

      //Modificateur de Mana
      if (statistiqueValue.statistique.id == StatistiqueIds.Mana) {


        // Profane & Divin
        if (personnage.niveauProfane && personnage.niveauProfane > 0 && personnage.niveauProfane > personnage.race.ajustement) {
          manaProfane = statistiqueValue.valeur;
          manaProfane += personnage.niveauProfane;
          manaProfane += 4;
        }
        if (personnage.niveauDivin && personnage.niveauDivin > 0 && personnage.niveauDivin > personnage.race.ajustement) {
          manaDivine = statistiqueValue.valeur;
          manaDivine += personnage.niveauDivin;
          manaDivine += 4;
        }

        //Modificateurs
        if (manaProfane > 0 || manaDivine > 0) {
          personnage.statistiques.forEach(statistiqueValueUpdate => {

            //Intelligence
            if (statistiqueValueUpdate.statistique.id == StatistiqueIds.Intelligence) {

              manaProfane += statistiqueValueUpdate.valeur;

              if (statistiqueValueUpdate.valeur == 1) {
                manaProfane = Math.round((personnage.niveauProfane / 2) + manaProfane);
              }
              if (statistiqueValueUpdate.valeur > 1) {
                manaProfane = Math.round(((personnage.niveauProfane + 1) / 2) + manaProfane);
              }

            }

            //Sagesse
            if (statistiqueValueUpdate.statistique.id == StatistiqueIds.Sagesse) {
              manaDivine += statistiqueValueUpdate.valeur;

              if (statistiqueValueUpdate.valeur == 1) {
                manaDivine = Math.round((personnage.niveauDivin / 2) + manaDivine);
              }
              if (statistiqueValueUpdate.valeur > 1) {
                manaDivine = Math.round(((personnage.niveauDivin + 1) / 2) + manaDivine);
              }

            }

          })
        }

      }

    });

    //Correcteur de Statistiques
    personnage.statistiques.forEach(statistiqueValue => {

      //Correcteur de Points de vie
      if (
        statistiqueValue.statistique.id == StatistiqueIds.PVTorse ||
        statistiqueValue.statistique.id == StatistiqueIds.PVBras ||
        statistiqueValue.statistique.id == StatistiqueIds.PVJambes
      ) {
        if (statistiqueValue.valeur <= 0) {
          statistiqueValue.valeur = 1;
        }
      }

      //Correcteur de Lutte
      if (statistiqueValue.statistique.id == StatistiqueIds.Lutte) {
        if (statistiqueValue.valeur < 0) {
          statistiqueValue.valeur = 0;
        }
      }

      //Correcteur de Mana
      if (statistiqueValue.statistique.id == StatistiqueIds.Mana) {
        if (manaProfane >= manaDivine) {
          statistiqueValue.valeur = manaProfane;
        } else {
          statistiqueValue.valeur = manaDivine;
        }
      }

    });

    return personnage;
  }

  public async getPersonnageCapaciteSpeciales(personnage: IPersonnage): Promise<IPersonnage> {

    if (!personnage.capaciteSpeciales) personnage.capaciteSpeciales = [];
    personnage?.statistiques.forEach(statistiqueValue => {
      let found: boolean = false;
      Object.values(StatistiqueIds).forEach((statistiqueId) => {
        if (statistiqueId == statistiqueValue.statistique.id) {
          found = true;
        }
      })
      if (!found) {
        personnage.capaciteSpeciales.push(statistiqueValue);
      }
    })

    return personnage;
  }

  private _saveState(item: IStatistique): IStatistiqueDB {
    return {
      nom: item.nom,
    };
  }

}