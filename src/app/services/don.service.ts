import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImmuniteService, IImmunite } from './immunite.service';
import { ResistanceService, ResistanceItem } from './resistance.service';
import { StatistiqueService, StatistiqueItem, IStatistique } from './statistique.service';
import { ClasseAuthorise } from './classe.service';
import { IRace } from './race.service';
import { IPersonnage } from './personnage.service';

export interface IDon extends IDonDB {
  id: string;
  modificateurs: IStatistique[];
  donsRequis: IDon[];
  immunites: IImmunite[];
  racesAutorise: IRace[];
}

export interface IDonDB {
  nom: string;
  description: string;
  niveauRequis: number;
  nlsRequis: number;
  niveauMaxObtention: number;
  categorie: string;
  afficherNiveau: boolean;
  modificateursRef: string[];
  classesAutorise: ClasseAuthorise[];
  donsRequisRef: string[];
  immunitesRef: string[];
  racesAutoriseRef: string[];
  resistances: ResistanceItem[];
  statistiques: StatistiqueItem[];
}

export class DonItem {
  constructor() {
    this.don = null;
    this.donRef = '';
    this.niveauObtention = 1;
    this.niveauEffectif = 1;
  }

  don: IDon;
  donRef: string;
  niveauObtention: number;
  niveauEffectif: number;
}

export const DonCategories = ['Normal', 'Connaissance', 'Statistique', 'Résistance', 'Immunité', 'Maniement', 'Épique', 'Metamagie', 'Création', 'Spécialisation Martiale'];

@Injectable()
export class DonService {

  constructor(
    private afs: AngularFirestore,
    private immuniteService: ImmuniteService,
    private resistanceService: ResistanceService,
    private statistiqueService: StatistiqueService
  ) { }

  public async getDons(categorie?: string): Promise<IDon[]> {
    const ref = this.afs.collection<IDon>('dons').ref.orderBy('nom');
    const query = categorie ? ref.where('categorie', '==', categorie).get() : ref.get();
    return (await query).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IDon;
      })
      .sort((a: IDon, b: IDon) => {
        return a.nom.localeCompare(b.nom);
      })
  }

  public async getDon(id: string, full?: boolean, fiche?: boolean): Promise<IDon> {
    const data = await this.afs.doc<IDon>(`dons/${id}`).ref.get();
    const don = {
      id: data.id,
      ...data.data()
    } as IDon;

    // ...
    // Pas sure encore si full est nécessaire
    if (full) {
      // this.getClassesAuthorise(don, observableBatch);
      // this.getDonsRequis(don, observableBatch);
      // this.getRaces(don, observableBatch);
    }

    if (fiche || full) {
      this._getImmunites(don);
      this._getResistances(don);
      this._getStatistiques(don);
      this._getModificateur(don);
    }

    return don;
  }

  public async addDon(don: IDon): Promise<IDon> {
    const data = await this.afs.collection(`dons`).add(this._saveState(don));
    return { id: data.id, ...don } as IDon;
  }

  public async updateDon(don: IDon): Promise<IDon> {
    await this.afs.doc<IDon>(`dons/${don.id}`).update(this._saveState(don));
    return don;
  }

  public async deleteDon(id: string): Promise<boolean> {
    await this.afs.doc<IDon>(`dons/${id}`).delete();
    return true;
  }

  public async getAvailableDons(personnage: IPersonnage): Promise<IDon[]> {

    const dons = await this.getDons();

    let list: IDon[] = dons;

    // Filtre les dons déjà existant
    if (personnage.dons && personnage.dons.length > 0) {
      personnage.dons.forEach(donPerso => {

        list = list.filter(don => {
          return don.id != donPerso.donRef;
        })

      });
    }

    // Filtre les Race Authorisé
    if (personnage.raceRef) {
      list = list.filter(function (don) {
        return don.racesAutoriseRef.includes(personnage.raceRef);
      });
    }

    // Filtre les classes authorisé
    if (personnage.classes) {

      let result: IDon[] = [];

      list.forEach(don => {
        don.classesAutorise.forEach(ca => {
          personnage.classes.forEach(classePerso => {
            if (classePerso.classeRef == ca.classeRef && classePerso.niveau >= ca.niveau) {
              if (!result.find(r => r.id == don.id)) {
                result.push(don);
              }
            }
          });
        });
      });

      list = result;

    }

    // Filtre les prérequis de dons
    if (personnage.dons) {

      let result: IDon[] = [];

      list.forEach(don => {

        let add: boolean = true;

        // No requirements
        if (don.donsRequisRef && don.donsRequisRef.length > 0) {

          // Make sure all requirements is filled
          don.donsRequisRef.forEach(donReqRef => {

            let found: boolean = false;

            personnage.dons.forEach(donPerso => {

              if (donReqRef == donPerso.donRef) {
                found = true;
              }

            });

            if (!found) {
              add = false;
            }

          });
        }

        if (add) {
          if (!result.find(r => r.id == don.id)) {
            result.push(don);
          }
          result.push(don);
        }

      });

      list = result;

    }

    // Filtre les restrictions de niveaux
    if (personnage.niveauReel) {

      // Filtre Niveau Max D'Obtention
      list = list.filter(don => {
        return don.niveauMaxObtention <= personnage.niveauReel
      });

      // Filtre Niveau Requis
      list = list.filter(don => {
        return don.niveauRequis <= personnage.niveauReel;
      });

    }

    // Trie en Ordre Alphabetic
    list = list.sort((a, b) => {
      if (a.nom > b.nom) {
        return 1;
      }
      if (a.nom < b.nom) {
        return -1;
      }
      return 0;
    });

    // Filter Duplicates
    list = list.filter((don, index, self) =>
      index === self.findIndex((d) => (
        d.id === don.id
      ))
    );

    return list;

  }

  public async getAvailableConnaissances(personnage: IPersonnage): Promise<IDon[]> {

    const dons = await this.getDons('Connaissance');

    let list: IDon[] = dons;

    // Filtre les dons déjà existant
    if (personnage.dons && personnage.dons.length > 0) {
      personnage.dons.forEach(donPerso => {

        list = list.filter(don => {
          return don.id != donPerso.donRef;
        })

      });
    }

    // Filtre les prérequis de dons
    if (personnage.dons) {

      let result: IDon[] = [];

      list.forEach(don => {

        let add: boolean = true;

        // No requirements
        if (don.donsRequisRef && don.donsRequisRef.length > 0) {

          // Make sure all requirements is filled
          don.donsRequisRef.forEach(donReqRef => {

            let found: boolean = false;

            personnage.dons.forEach(donPerso => {

              if (donReqRef == donPerso.donRef) {
                found = true;
              }

            });

            if (!found) {
              add = false;
            }

          });
        }

        if (add) {
          result.push(don);
        }

      });

      list = result;

    }

    // Filtre les restrictions de niveaux
    if (personnage.niveauReel) {

      // Filtre Niveau Max D'Obtention
      list = list.filter(don => {
        return don.niveauMaxObtention <= personnage.niveauReel
      });

      // Filtre Niveau Requis
      list = list.filter(don => {
        return don.niveauRequis <= personnage.niveauReel;
      });

    }

    // Trie en Ordre Alphabetic
    list = list.sort((a, b) => {
      if (a.nom > b.nom) {
        return 1;
      }
      if (a.nom < b.nom) {
        return -1;
      }
      return 0;
    });

    return list;

  }

  public async getPersonnageDons(personnage: IPersonnage): Promise<IPersonnage> {

    // Dons Racial
    if (personnage.race && personnage.race.donsRacialRef && personnage.race.donsRacialRef.length > 0) {
      personnage.race.donsRacialRef.forEach(donRef => {
        let donItem: DonItem = new DonItem();
        donItem.donRef = donRef;
        personnage.dons.push(donItem);
      })
    }

    // Dons Classes
    if (personnage.classes && personnage.classes.length > 0) {
      personnage.classes.forEach(classeItem => {
        if (classeItem.classe.dons && classeItem.classe.dons.length > 0) {
          classeItem.classe.dons.forEach(donItem => {
            if (classeItem.niveau >= donItem.niveauObtention) {
              personnage.dons.push(donItem);
            }
          })
        }
      });
    }

    // Dons Domaines
    if (personnage.domaines && personnage.domaines.length > 0) {
      personnage.domaines.forEach(domaine => {
        if (domaine.dons && domaine.dons.length > 0) {
          domaine.dons.forEach(donItem => {
            personnage.classes.forEach(classe => {
              if (classe.classeRef == 'fNqknNgq0QmHzUaYEvEd' && classe.niveau >= donItem.niveauObtention) {
                personnage.dons.push(donItem);
              }
            })
          })
        }
      });
    }

    // Dons Esprit
    if (personnage.esprit && personnage.esprit.dons && personnage.esprit.dons.length > 0) {
      personnage.esprit.dons.forEach(donItem => {
        personnage.classes.forEach(classe => {
          if (classe.classeRef == 'wW48swrqmr77awfyADMX' && classe.niveau >= donItem.niveauObtention) {
            personnage.dons.push(donItem);
          }
        })
      })
    };

    // Dons Fourberies (Équivalence)
    if (personnage.fourberies) {
      personnage.fourberies.forEach(fourberie => {
        if (fourberie.fourberie && fourberie.fourberie.donsEquivalentRef && fourberie.fourberie.donsEquivalentRef.length > 0) {
          fourberie.fourberie.donsEquivalentRef.forEach(aptDonRef => {
            let donItem = new DonItem();
            donItem.niveauObtention = fourberie.niveauObtention;
            donItem.donRef = aptDonRef;
            personnage.dons.push(donItem);
          });
        }
      })
    }

    // Dons Aptitudes (Équivalence)
    if (personnage.aptitudes) {
      personnage.aptitudes.forEach(aptitude => {
        if (aptitude.aptitude && aptitude.aptitude.donsEquivalentRef) {
          aptitude.aptitude.donsEquivalentRef.forEach(aptDonRef => {
            let donItem = new DonItem();
            donItem.niveauObtention = aptitude.niveauObtention;
            donItem.donRef = aptDonRef;
            personnage.dons.push(donItem);
          });
        }
      })
    }

    // Remplis la liste de dons complète
    let count: number = 0;
    if (!personnage.dons) personnage.dons = [];

    if (personnage.dons && personnage.dons.length > 0) {

      personnage.dons.forEach(async (donItem) => {

        if (!donItem.don) { //Avoid fetching Don if already fetch
          const don = await this.getDon(donItem.donRef, false, true);
          donItem.don = don;
          count++;
          if (count == personnage.dons.length) {

            // Filter duplicated
            personnage.dons = personnage.dons.filter((don, index, self) =>
              index === self.findIndex((d) => (
                d.donRef === don.donRef
              ))
            )

            return personnage;
          }

        } else {
          count++;
          if (count == personnage.dons.length) {

            // Filter duplicated
            personnage.dons = personnage.dons.filter((don, index, self) =>
              index === self.findIndex((d) => (
                d.donRef === don.donRef
              ))
            )

            return personnage;
          }
        }

      });

    } else {
      return personnage;
    }

  }

  public async getPersonnageDonsNiveauEffectif(personnage: IPersonnage): Promise<IPersonnage> {

    if (personnage.dons && personnage.statistiques) {
      personnage.dons.forEach(donItem => {

        if (donItem.don.afficherNiveau) {

          //Niveau Effectif du Personnage et Niveau d'Obtention
          donItem.niveauEffectif = personnage.niveauEffectif - (donItem.niveauObtention - 1);

          //Modificateur de Statistique
          if (donItem.don.modificateurs && donItem.don.modificateurs.length > 0) {
            donItem.don.modificateurs.forEach(modificateur => {
              personnage.statistiques.forEach(statistiqueValue => {
                if (statistiqueValue.statistique.id == modificateur.id) {
                  donItem.niveauEffectif += statistiqueValue.valeur;
                }
              });
            })
          }

        }

      })
    }

    // Remplis la liste de dons complète
    return personnage;
  }

  private _saveState(item: IDon): IDonDB {

    if (!item.afficherNiveau) item.afficherNiveau = false;
    if (!item.classesAutorise) item.classesAutorise = [];
    if (!item.donsRequisRef) item.donsRequisRef = [];
    if (!item.immunitesRef) item.immunitesRef = [];
    if (!item.racesAutoriseRef) item.racesAutoriseRef = [];
    if (!item.resistances) item.resistances = [];
    if (!item.statistiques) item.statistiques = [];
    if (!item.modificateursRef) item.modificateursRef = [];

    //Filter Out
    item.classesAutorise.forEach(classe => {
      classe.classe = null;
    });
    item.resistances.forEach(resistance => {
      resistance.resistance = null;
    });
    item.statistiques.forEach(statistique => {
      statistique.statistique = null;
    });

    return {
      nom: item.nom,
      description: item.description,
      niveauRequis: item.niveauRequis,
      nlsRequis: item.nlsRequis,
      niveauMaxObtention: item.niveauMaxObtention,
      categorie: item.categorie,
      afficherNiveau: item.afficherNiveau,
      classesAutorise: item.classesAutorise.map((obj) => { return { ...obj } }),
      donsRequisRef: item.donsRequisRef,
      immunitesRef: item.immunitesRef,
      racesAutoriseRef: item.racesAutoriseRef,
      resistances: item.resistances.map((obj) => { return { ...obj } }),
      statistiques: item.statistiques.map((obj) => { return { ...obj } }),
      modificateursRef: item.modificateursRef
    };
  }

  // ...
  // Pas sure encore si je dois garder c'est 3 methodes la

  // private getClassesAuthorise(don: Don, observableBatch: any[]) {
  //   if (don.classesAutorise && don.classesAutorise.length > 0) {
  //     don.classesAutorise.forEach(classeAuthorise => {
  //       observableBatch.push(this.db.doc$('classes/' + classeAuthorise.classeRef).pipe(
  //         map((classe: Classe) => {
  //           classeAuthorise.classe = classe;
  //         }), first()
  //       ))
  //     });
  //   }
  // }

  // private getDonsRequis(don: Don, observableBatch: any[]) {
  //   if (don.donsRequisRef) {
  //     don.donsRequisRef.forEach(donRequisRef => {
  //       observableBatch.push(this.getDon(donRequisRef).pipe(
  //         map((don: Don) => {
  //           if (!don.donsRequis) don.donsRequis = [];
  //           don.donsRequis.push(don);
  //         }), first()
  //       ))
  //     });
  //   }
  // }

  // private getRaces(don: Don, observableBatch: any[]) {
  //   if (don.racesAutoriseRef) {
  //     don.racesAutoriseRef.forEach(raceRef => {
  //       observableBatch.push(this.db.doc$('races/' + raceRef).pipe(
  //         map((race: Race) => {
  //           if (!don.racesAutorise) don.racesAutorise = [];
  //           don.racesAutorise.push(race);
  //         }),
  //         first()
  //       ))
  //     });
  //   }
  // }

  private _getImmunites(don: IDon): void {
    if (don.immunitesRef) {
      don.immunitesRef.forEach(async (immuniteRef) => {
        if (!don.immunites) don.immunites = [];
        don.immunites.push(await this.immuniteService.getImmunite(immuniteRef));
      });
    }
  }

  private _getResistances(don: IDon): void {
    if (don.resistances && don.resistances.length > 0) {
      don.resistances.forEach(async (resistanceItem: ResistanceItem) => {
        resistanceItem.resistance = await this.resistanceService.getResistance(resistanceItem.resistanceRef);
      });
    }
  }

  private _getStatistiques(don: IDon): void {
    if (don.statistiques && don.statistiques.length > 0) {
      don.statistiques.forEach(async (statistiqueItem: StatistiqueItem) => {
        statistiqueItem.statistique = await this.statistiqueService.getStatistique(statistiqueItem.statistiqueRef);
      });
    }
  }

  private _getModificateur(don: IDon): void {
    if (don.modificateursRef && don.modificateursRef.length > 0) {
      don.modificateursRef.forEach(async (modificateurRef) => {
        if (!don.modificateurs) don.modificateurs = [];
        don.modificateurs.push(await this.statistiqueService.getStatistique(modificateurRef));
      });
    }
  }

}