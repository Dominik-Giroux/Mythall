import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../firestore/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../layout/dialogs/loading/loading.dialog.component';
import { Personnage } from './models/personnage';
import { AptitudeService } from '../aptitudes/aptitude.service';
import { AptitudeItem } from '../aptitudes/models/aptitude';
import { ClasseService } from '../classes/classe.service';
import { Classe, ClasseItem } from '../classes/models/classe';
import { DonService } from '../dons/don.service';
import { Don, DonItem } from '../dons/models/don';
import { RaceService } from '../races/race.service';
import { UserService } from '../@core/user.service';
import { StatistiqueService } from '../statistique.service';
import { StatistiqueValue } from '../../models/statistique';
import { ResistanceValue } from '../../models/resistance';
import { StatistiquesIds } from '../../models/statistiqueIds';
import { DomaineService } from '../domaines/domaine-service';
import { DieuService } from '../dieu.service';
import { AlignementService } from '../alignement.service';
import { EspritService } from '../esprits/esprit-service';
import { SortService } from '../sorts/sort.service';
import { SortItem, Sort } from '../sorts/models/sort';
import { OrdreService } from '../ordres/ordre.service';
import { Build } from './models/build';
import { FourberieService } from '../fourberies/fourberie.service';
import { rejects } from 'assert';
import { Esprit } from '../esprits/models/esprit';
import { Choix } from './models/choix';
import { Domaine } from '../domaines/models/domaine';
import { Ecole } from '../../models/ecole';
import { EcoleService } from '../ecole.service';
import { Alignement } from '../../models/alignement';
import { Fourberie } from '../fourberies/models/fourberie';
import { Dieu } from '../../models/dieu';
import { Ordre } from '../ordres/models/ordre';

@Injectable()
export class PersonnageService {

  constructor(
    private db: FirestoreService,
    private dialog: MatDialog,
    private alignementService: AlignementService,
    private aptitudeService: AptitudeService,
    private classeService: ClasseService,
    private domaineService: DomaineService,
    private donService: DonService,
    private dieuService: DieuService,
    private ecoleService: EcoleService,
    private espritService: EspritService,
    private fourberieService: FourberieService,
    private ordreService: OrdreService,
    private raceService: RaceService,
    private sortService: SortService,
    private statistiqueService: StatistiqueService,
    private userService: UserService
  ) { }

  //#region Progress Utilities
  private build: Build = new Build();
  private fullBuild: boolean = false;
  private totalAmountOfStatistiques: number = 10;

  private resetBuild() {
    this.fullBuild = false;
    this.build = new Build();
  }

  //#endregion

  //#region Service
  getPersonnages(): Observable<Personnage[]> {
    return this.db.colWithIds$('personnages', ref => ref.orderBy('createdAt'));
  }

  getPersonnage(id: string): Observable<Personnage> {
    return this.db.doc$('personnages/' + id);
  }

  addPersonnage(personnage: Personnage) {
    return this.db.add('personnages', personnage, personnage.nom);
  }

  updatePersonnage(id: string, personnage: Personnage) {
    return this.db.update('personnages/' + id, personnage, personnage.nom);
  }

  deletePersonnage(personnage: Personnage) {
    return this.db.delete('personnages/' + personnage.id, personnage.nom);
  }

  getPersonnagesByUser(userUid: string): Observable<Personnage[]> {
    return this.db.colWithIds$('personnages', ref => ref.where('userRef', '==', userUid).orderBy('createdAt'));
  }

  //#endregion

  //#region Maps
  map(data: Personnage): Personnage {
    this.resetBuild();
    this.fullBuild = true;
    var personnage: Personnage = new Personnage();
    for (var key in data) {
      personnage[key] = data[key]
    }
    this.dialog.open(LoadingDialogComponent);
    this.buildPromise(personnage);
    return personnage;
  }

  mapDefault(data: Personnage): Personnage {
    var personnage: Personnage = new Personnage();
    for (var key in data) {
      personnage[key] = data[key]
    }
    return personnage;
  }

  buildPromise(data: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      // Map Personnage
      var personnage: Personnage = new Personnage();
      for (var key in data) {
        personnage[key] = data[key]
      }

      this.buildPersonnage(personnage).then(completedPersonnage => {
        resolve(completedPersonnage);
      }).catch(error => {
        console.log(error);
        reject(error);
      });

    });

  }

  //#endregion

  //#region Availabilities

  getChoixPersonnage(personnage: Personnage, progressingClasse: ClasseItem): Promise<Choix[]> {

    return new Promise((resolve) => {

      let listChoix: Choix[] = [];

      // Dons aux 3 niveaux & don niveau 1
      if (personnage.niveauReel % 3 == 0 || personnage.niveauReel == 1) {

        const don: Choix = new Choix();
        don.type = 'don';
        don.categorie = 'Normal';
        don.niveauObtention = personnage.niveauReel;
        don.quantite = 1;

        listChoix.push(Object.assign({}, don));

      }

      // Don Racial Humain
      if (personnage.raceRef == 'RkYWeQrxFkmFaepDM09n' && personnage.niveauReel == 1) {

        const don: Choix = new Choix();
        don.type = 'don';
        don.categorie = 'Normal';
        don.niveauObtention = 1;
        don.quantite = 1;

        listChoix.push(Object.assign({}, don));

      }

      // Don Racial Elf
      if (personnage.raceRef == '5hteaYQ4K8J1MaAvU9Zh' && personnage.niveauReel == 1) {

        const don: Choix = new Choix();
        don.type = 'don';
        don.categorie = 'Connaissance';
        don.niveauObtention = 1;
        don.quantite = 1;

        listChoix.push(Object.assign({}, don));

      }

      // Get Choix de Classe
      if (personnage.classes) {
        personnage.classes.forEach(classeItem => {

          // Choix de classe
          if (classeItem.classeRef == progressingClasse.classeRef && classeItem.niveau == progressingClasse.niveau) {
            classeItem.classe.choix.forEach(choix => {
              if (choix.niveauObtention == progressingClasse.niveau) {
                listChoix.push(choix);
              }
            });
          }

        });
      }

      // Domaines
      if (personnage.domaines && personnage.domaines.length > 0) {
        personnage.domaines.forEach(domaine => {

          // Prêtre
          if (progressingClasse.classeRef == 'fNqknNgq0QmHzUaYEvEd') {
            domaine.choix.forEach(choixDomaine => {
              if (choixDomaine.niveauObtention == progressingClasse.niveau) {
                listChoix.push(choixDomaine);
              }
            });
          }

        });
      }

      // ...

      // console.log(listChoix);
      resolve(listChoix);

    });

  }

  getChoixClasse(personnage: Personnage, progressingClasse: ClasseItem): Promise<Choix[]> {

    return new Promise((resolve) => {

      let listChoix: Choix[] = [];

      // Get All Classes Choices
      if (personnage.classes) {
        personnage.classes.forEach(classeItem => {

          // Choix de classe
          if (classeItem.classeRef == progressingClasse.classeRef && classeItem.niveau == progressingClasse.niveau) {
            classeItem.classe.choix.forEach(choix => {
              listChoix.push(choix);
            });
          }

        });
      }

      resolve(listChoix);

    });

  }

  getChoixDomaine(personnage: Personnage, progressingClasse: ClasseItem): Promise<Choix[]> {

    return new Promise((resolve) => {

      let listChoix: Choix[] = [];

      // Get All Classes Choices
      if (progressingClasse.classeRef == 'fNqknNgq0QmHzUaYEvEd') {
        personnage.classes.forEach(classeItem => {

          // Choix de domaine
          if (classeItem.classeRef == 'fNqknNgq0QmHzUaYEvEd' && progressingClasse.niveau == classeItem.niveau) { // ID de prêtre
            personnage.domaines.forEach(domaine => {
              domaine.choix.forEach(choix => {
                listChoix.push(choix);
              });
            });
          }

        });
      }

      resolve(listChoix);

    });

  }

  getAvailableAlignements(personnage: Personnage): Promise<Alignement[]> {

    return new Promise((resolve) => {

      this.db.getCollection('alignements').then(alignements => {

        let list: Alignement[] = alignements;

        // Filtre selon la race
        if (personnage.race) {
          list = list.filter(function (alignement) {
            return personnage.race.alignementPermisRef.includes(alignement.id);
          });
        }

        // Filtre selon les classes
        if (personnage.classes) {
          personnage.classes.forEach(classe => {
            list = list.filter(function (alignement) {
              return classe.classe.alignementPermisRef.includes(alignement.id);
            });
          });
        }

        resolve(list);

      });

    });

  }

  getAvailableClasses(personnage: Personnage): Promise<Classe[]> {

    return new Promise((resolve) => {

      this.db.getCollection('classes').then(classes => {

        let list: Classe[] = classes;

        // Filtre selon la race
        if (personnage.race) {
          list = list.filter(function (classe) {
            return personnage.race.classesDisponibleRef.includes(classe.id);
          });
        }

        // Filtre selon les classes
        if (personnage.classes) {
          personnage.classes.forEach(classePerso => {

            // Multiclassement
            list = list.filter(function (classe) {
              return classePerso.classe.multiclassementRef.includes(classe.id);
            });

            // Ajoute la classe actuelle (Filtré au multiclassement);
            list.push(classePerso.classe);

            // Alignement Permis
            if (personnage.alignementRef) {
              list = list.filter(function (classe) {
                return classePerso.classe.alignementPermisRef.includes(personnage.alignementRef);
              });
            }

          });
        }

        // Ordres
        if (personnage.ordres && personnage.ordres.length > 0) {
          personnage.ordres.forEach(ordre => {
            list = list.filter(function (classe) {
              return ordre.classeRef.includes(classe.id);
            });
          })
        }

        // Domaines
        if (personnage.domaines && personnage.domaines.length > 0) {
          personnage.domaines.forEach(domaine => {
            list = list.filter(function (classe) {
              return domaine.multiclassementRef.includes(classe.id);
            });
          })
        }

        // Ajoute les classes existante
        if (personnage.classes) {

          // Retire les autres classes si déjà 3 existantes
          if (personnage.classes.length >= 3) {
            list = [];
          }

          // Ajoute Chaques classe existante
          personnage.classes.forEach(classePerso => {
            list.push(classePerso.classe);
          });

          // Filtre les doubles
          list = list.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === pos;
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

        resolve(list);

      });

    });

  }

  getAvailableConnaissances(personnage: Personnage): Promise<Don[]> {

    return new Promise((resolve) => {

      this.donService.getDonsByCategorie('Connaissance').then(dons => {

        let list: Don[] = dons;

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

          let result: Don[] = [];

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

        resolve(list);

      });

    });

  }

  getAvailableDons(personnage: Personnage): Promise<Don[]> {

    return new Promise((resolve) => {

      this.db.getCollection('dons').then(dons => {

        let list: Don[] = dons;

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

          let result: Don[] = [];

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

          let result: Don[] = [];

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

        resolve(list);

      });

    });



  }

  getAvailableDomaines(personnage: Personnage): Promise<Domaine[]> {

    return new Promise((resolve) => {

      this.domaineService.getDomaines().subscribe(domaines => {

        let list: Domaine[] = domaines;

        // Filtre selon l'alignement du personnage
        if (personnage.alignementRef) {
          list = list.filter(function (domaine) {
            return domaine.alignementPermisRef.includes(personnage.alignementRef);
          });
        }

        // Filtre selon les domaines du personnage
        if (personnage.domaines && personnage.domaines.length > 0) {
          personnage.domaines.forEach(domainePersonnage => {

            // Filtre domaine existant
            list = list.filter(function (domaine) {
              return domaine.id != domainePersonnage.id;
            });

            // Filtre domaine oposé
            list = list.filter(function (domaine) {
              return domaine.id != domainePersonnage.domaineContraireRef;
            });

          });
        }

        resolve(list);

      });

    });

  }

  getAvailableEcoles(personnage: Personnage): Promise<Ecole[]> {

    return new Promise((resolve) => {

      this.ecoleService.getEcoles().subscribe(ecoles => resolve(ecoles));

    });

  }

  getAvailableEsprits(personnage: Personnage): Promise<Esprit[]> {

    return new Promise((resolve) => {

      this.espritService.getEsprits().subscribe(esprits => resolve(esprits));

    });

  }

  getAvailableOrdres(personnage: Personnage): Promise<Ordre[]> {

    return new Promise((resolve) => {

      this.ordreService.getOrdres().subscribe(ordres => {

        let list: Ordre[] = ordres;

        // Filtre selon l'alignement du personnage
        if (personnage.alignementRef) {
          list = list.filter(function (ordre) {
            return ordre.alignementPermisRef.includes(personnage.alignementRef);
          });
        }

        // Filtre selon les classes
        if (personnage.classes) {
          personnage.classes.forEach(classe => {
            list = list.filter(function (ordre) {
              return ordre.classeRef.includes(classe.classeRef);
            });
          });
        }

        resolve(list)

      });

    });

  }

  getAvailableFourberies(personnage: Personnage): Promise<Fourberie[]> {

    return new Promise((resolve) => {

      this.db.getCollection('fourberies').then(fourberies => {

        let list: Fourberie[] = fourberies;

        // Filtre les fourberies déjà existant
        if (personnage.fourberies && personnage.fourberies.length > 0) {
          personnage.fourberies.forEach(fourberiesPerso => {

            list = list.filter(fourberie => {
              return fourberie.id != fourberiesPerso.fourberieRef;
            })

          });
        }

        // Filtre les prérequis de fourberie
        if (personnage.fourberies) {

          let result: Fourberie[] = [];

          list.forEach(fourberie => {

            let add: boolean = true;

            // No requirements
            if (fourberie.fourberiesRequisRef && fourberie.fourberiesRequisRef.length > 0) {

              // Make sure all requirements is filled
              fourberie.fourberiesRequisRef.forEach(fourberieReqRef => {

                let found: boolean = false;

                personnage.fourberies.forEach(fourberiePerso => {

                  if (fourberieReqRef == fourberiePerso.fourberieRef) {
                    found = true;
                  }

                });

                if (!found) {
                  add = false;
                }

              });
            }

            if (add) {
              result.push(fourberie);
            }

          });

          list = result;

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

        resolve(list);

      });

    });

  }

  getAvailableSorts(personnage: Personnage): Promise<Sort[]> {

    return new Promise((resolve) => {

      let list: Sort[] = [];
      let listRef: string[] = [];

      // Get list de sort disponible
      if (personnage.classes) {

        personnage.classes.forEach(classe => {
          classe.classe.sortsDisponible.forEach(sortDispo => {
            if (sortDispo.niveauObtention <= classe.niveau) {
              this.sortService.getSort(sortDispo.sortRef).subscribe(sort => {
                list.push(sort);
              });
            }
          });
        });

      }

      // Filtre les sorts déjà existant
      if (personnage.sorts && personnage.sorts.length > 0) {
        personnage.sorts.forEach(sortPerso => {

          list = list.filter(sort => {
            return sort.id != sortPerso.sortRef;
          })

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

      resolve(list);

    });

  }

  getAvailableDieux(personnage: Personnage): Promise<Dieu[]> {

    return new Promise((resolve) => {

      this.db.getCollection('dieux').then(dieux => {

        let list: Dieu[] = dieux;

        // Filtre selon l'alignement du personnage
        if (personnage.alignementRef) {
          list = list.filter(function (dieu) {
            return dieu.alignementPermisRef.includes(personnage.alignementRef);
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

        resolve(list);

      });

    });

  }

  //#endregion

  //#region Build Personnage

  private buildPersonnage(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      this.dialog.open(LoadingDialogComponent);
      console.log("Building Personnage...");

      Promise.all([
        this.getUser(personnage),
        this.getRace(personnage),
        this.getClasses(personnage),
        this.getAlignement(personnage),
        this.getDieu(personnage),
        this.getOrdres(personnage),
        this.getAllFourberies(personnage)
      ]).then((results) => {

        console.log("Building Niveau Effectif...");

        this.getNiveauEffectif(personnage).then(results => {

          console.log("Building Domaines & Esprits...");

          Promise.all([
            this.getDomaines(personnage),
            this.getEsprit(personnage)
          ]).then(results => {

            console.log("Building Aptitudes...");

            this.getAllAptitudes(personnage).then(result => {

              console.log("Building Sorts & Dons...");

              Promise.all([
                this.getAllSorts(personnage),
                this.getAllDons(personnage)
              ]).then(results => {

                console.log("Building Base Statistiques...");

                this.getStatistiquesParDefault(personnage).then(result => {

                  console.log('Building Statistiques, Resistances & Immunities...');

                  Promise.all([
                    this.getStatistiques(personnage),
                    this.getResistances(personnage),
                    this.getImmunites(personnage)
                  ]).then(results => {

                    console.log("Building Niveau de dons & Capacité spéciales...");

                    Promise.all([
                      this.getDonsNiveauEffectif(personnage),
                      this.getCapaciteSpeciales(personnage)
                    ]).then(results => {

                      console.log("Personnage Build Completed");
                      console.log(personnage);

                      // Completed
                      this.dialog.closeAll();

                      // Resolving
                      resolve(personnage);

                    }).catch(error => {
                      reject(error);
                    });
                  }).catch(error => {
                    reject(error);
                  });
                }).catch(error => {
                  reject(error);
                })
              }).catch(error => {
                reject(error);
              });
            }).catch(error => {
              reject(error);
            });
          }).catch(error => {
            reject(error);
          });
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });

  }

  private getUser(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      this.userService.getUser(personnage.userRef).subscribe(response => {
        personnage.user = response;
        resolve(personnage)
      }, error => {
        reject(error);
      });

    })

  }

  private getRace(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      this.raceService.getRace(personnage.raceRef).pipe(
        map(race => {
          personnage.race = race;
        })
      ).subscribe(() => {
        resolve(personnage);
      }, error => {
        reject(error);
      });

    });

  }

  private getClasses(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      let count: number = 0;

      personnage.classes.forEach(classeItem => {

        this.classeService.getClasse(classeItem.classeRef).pipe(
          map(classe => {
            classeItem.classe = classe;
          })
        ).subscribe(() => {

          count++;
          if (count == personnage.classes.length) {
            resolve(personnage);
          }

        }, error => {
          reject(error);
        });

      });

    });

  }

  private getAlignement(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      if (personnage.alignementRef) {
        this.alignementService.getAlignement(personnage.alignementRef).subscribe(response => {

          personnage.alignement = response;
          resolve(personnage);

        }, error => {
          reject(error);
        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getDieu(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      if (personnage.dieuRef) {
        this.dieuService.getDieu(personnage.dieuRef).subscribe(response => {

          personnage.dieu = response;
          resolve(personnage);

        }, error => {
          reject(error);
        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getOrdres(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      // Retourne seulement la liste des ordres du personnage
      let count: number = 0;
      if (!personnage.ordresRef) personnage.ordresRef = [];

      if (personnage.ordresRef && personnage.ordresRef.length > 0) {
        personnage.ordresRef.forEach(ordreRef => {
          this.ordreService.getOrdre(ordreRef).pipe(
            map(ordre => {

              if (!personnage.ordres) personnage.ordres = [];
              personnage.ordres.push(ordre);

            })
          ).subscribe(response => {
            count++;
            if (count == personnage.ordresRef.length) {
              resolve(personnage);
            }
          }, error => {
            reject(error);
          });
        });
      } else {
        resolve(personnage);
      }

    });

  }

  private getNiveauEffectif(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      personnage.niveauEffectif = 0;
      personnage.niveauReel = 0;
      personnage.niveauProfane = 0;
      personnage.niveauDivin = 0;

      if (personnage.classes) {

        personnage.classes.forEach(classe => {
          personnage.niveauEffectif += classe.niveau;
          personnage.niveauReel += classe.niveau;

          if (classe.classe.sort == 'Profane') {
            personnage.niveauProfane += classe.niveau;
          }

          if (classe.classe.sort == 'Divin') {
            personnage.niveauDivin += classe.niveau;
          }

        });

      }

      if (personnage.race) {
        if (personnage.race.ajustement) {
          personnage.niveauEffectif += +personnage.race.ajustement;
          personnage.niveauProfane += +personnage.race.ajustement;
          personnage.niveauDivin += +personnage.race.ajustement;
        }
      }

      resolve(personnage);

    });

  }

  private getDomaines(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      if (personnage.domainesRef && personnage.domainesRef.length > 0) {

        let count: number = 0;

        personnage.domainesRef.forEach(domaineRef => {
          this.domaineService.getDomaine(domaineRef).pipe(
            map(domaine => {

              if (!personnage.domaines) personnage.domaines = [];
              personnage.domaines.push(domaine);

            })
          ).subscribe(response => {

            count++;
            if (count == personnage.domainesRef.length) {

              resolve(personnage);

            }

          }, error => {
            reject(error);
          });

        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getEsprit(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      if (personnage.espritRef) {

        this.espritService.getEsprit(personnage.espritRef).subscribe(response => {

          personnage.esprit = response;
          resolve(personnage);

        }, error => {
          reject(error);
        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getAllFourberies(personnage: Personnage): Promise<Personnage> {

    // Remplis la liste de fourberies complète
    return new Promise((resolve, reject) => {

      let count: number = 0;
      if (!personnage.fourberies) personnage.fourberies = [];

      if (personnage.fourberies && personnage.fourberies.length > 0) {

        personnage.fourberies.forEach(fourberieItem => {

          if (!fourberieItem.fourberie) { //Avoid fetching Fourberie if already fetch

            this.fourberieService.getFourberie(fourberieItem.fourberieRef).pipe(
              map(fourberie => {

                fourberieItem.fourberie = fourberie;

              })
            ).subscribe(response => {

              count++;

              if (count == personnage.fourberies.length) {

                // Filter Duplicates
                personnage.fourberies = personnage.fourberies.filter((fourberie, index, self) =>
                  index === self.findIndex((d) => (
                    d.fourberieRef === fourberie.fourberieRef
                  ))
                )

                resolve(personnage);

              }

            }, error => {
              reject(error);
            });

          } else {

            count++;

            if (count == personnage.fourberies.length) {

              // Filter Duplicates
              personnage.fourberies = personnage.fourberies.filter((fourberie, index, self) =>
                index === self.findIndex((d) => (
                  d.fourberieRef === fourberie.fourberieRef
                ))
              )

              resolve(personnage);

            }

          }

        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getAllAptitudes(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      // Aptitudes Racial
      if (personnage.race && personnage.race.aptitudesRacialRef && personnage.race.aptitudesRacialRef.length > 0) {
        personnage.race.aptitudesRacialRef.forEach(aptitudeRef => {
          let aptitudeItem: AptitudeItem = new AptitudeItem();
          aptitudeItem.aptitudeRef = aptitudeRef;
          personnage.aptitudes.push(aptitudeItem);
        })
      };

      // Aptitudes Classes
      if (personnage.classes && personnage.classes.length > 0) {
        personnage.classes.forEach(classeItem => {
          if (classeItem.classe.aptitudes && classeItem.classe.aptitudes.length > 0) {
            classeItem.classe.aptitudes.forEach(aptitudeItem => {
              if (classeItem.niveau >= aptitudeItem.niveauObtention) {
                personnage.aptitudes.push(aptitudeItem);
              }
            })
          }
        });
      }

      // Aptitudes Domaines
      if (personnage.domaines && personnage.domaines.length > 0) {
        personnage.domaines.forEach(domaine => {
          if (domaine.aptitudes && domaine.aptitudes.length > 0) {
            domaine.aptitudes.forEach(aptitudeItem => {
              personnage.classes.forEach(classe => {
                if (classe.classeRef == 'fNqknNgq0QmHzUaYEvEd' && classe.niveau >= aptitudeItem.niveauObtention) {
                  personnage.aptitudes.push(aptitudeItem);
                }
              })
            })
          }
        });
      }

      // Aptitudes Esprit
      if (personnage.esprit && personnage.esprit.aptitudes && personnage.esprit.aptitudes.length > 0) {
        personnage.esprit.aptitudes.forEach(aptitudeItem => {
          personnage.classes.forEach(classe => {
            if (classe.classeRef == 'wW48swrqmr77awfyADMX' && classe.niveau >= aptitudeItem.niveauObtention) {
              personnage.aptitudes.push(aptitudeItem);
            }
          })
        })
      };

      // Remplis la liste de aptitudes complète
      let count: number = 0;
      if (!personnage.aptitudes) personnage.aptitudes = [];

      if (personnage.aptitudes && personnage.aptitudes.length > 0) {

        personnage.aptitudes.forEach(aptitudeItem => {

          if (!aptitudeItem.aptitude) {
            this.aptitudeService.getAptitude(aptitudeItem.aptitudeRef).pipe(
              map(aptitude => {

                aptitudeItem.aptitude = aptitude;

              })
            ).subscribe(response => {

              count++;
              if (count == personnage.aptitudes.length) {

                // Filter Duplicates
                personnage.aptitudes = personnage.aptitudes.filter((aptitude, index, self) =>
                  index === self.findIndex((d) => (
                    d.aptitudeRef === aptitude.aptitudeRef
                  ))
                )

                resolve(personnage);

              }

            }, error => {
              reject(error);
            });

          } else {

            count++;
            if (count == personnage.aptitudes.length) {

              // Filter Duplicates
              personnage.aptitudes = personnage.aptitudes.filter((aptitude, index, self) =>
                index === self.findIndex((d) => (
                  d.aptitudeRef === aptitude.aptitudeRef
                ))
              )

              resolve(personnage);

            }
          }

        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getAllSorts(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      // Sorts Classes
      if (personnage.classes && personnage.classes.length > 0) {
        personnage.classes.forEach(classeItem => {
          if (classeItem.classe.sorts && classeItem.classe.sorts.length > 0) {
            classeItem.classe.sorts.forEach(sortItem => {
              if (classeItem.niveau >= sortItem.niveauObtention) {
                personnage.sorts.push(sortItem);
              }
            })
          }
        });
      }

      // Sorts Domaines
      if (personnage.domaines && personnage.domaines.length > 0) {
        personnage.domaines.forEach(domaine => {
          if (domaine.sorts && domaine.sorts.length > 0) {
            domaine.sorts.forEach(sortItem => {
              personnage.classes.forEach(classe => {
                if (classe.classeRef == 'fNqknNgq0QmHzUaYEvEd' && classe.niveau >= sortItem.niveauObtention) {
                  personnage.sorts.push(sortItem);
                }
              })
            })
          }
        });
      }

      // Sorts Esprit
      if (personnage.esprit && personnage.esprit.sorts && personnage.esprit.sorts.length > 0) {
        personnage.esprit.sorts.forEach(sortItem => {
          personnage.classes.forEach(classe => {
            if (classe.classeRef == 'wW48swrqmr77awfyADMX' && classe.niveau >= sortItem.niveauObtention) {
              personnage.sorts.push(sortItem);
            }
          })
        })
      };

      // Sorts Aptitudes (Équivalence)
      if (personnage.aptitudes && personnage.aptitudes.length > 0) {
        personnage.aptitudes.forEach(aptitudeItem => {
          if (aptitudeItem.aptitude.sortsEquivalentRef && aptitudeItem.aptitude.sortsEquivalentRef.length > 0) {
            aptitudeItem.aptitude.sortsEquivalentRef.forEach(aptSortRef => {
              let sortItem: SortItem = new SortItem();
              sortItem.niveauObtention = aptitudeItem.niveauObtention;
              sortItem.sortRef = aptSortRef;
              personnage.sorts.push(sortItem);
            });
          }
        })
      }

      // Remplis la liste de sorts complète
      let count: number = 0;
      if (!personnage.sorts) personnage.sorts = [];
      if (personnage.sorts && personnage.sorts.length > 0) {
        personnage.sorts.forEach(sortItem => {

          if (!sortItem.sort) { //Avoid fetching Sort if already fetch
            this.sortService.getSort(sortItem.sortRef).pipe(
              map(sort => {

                sortItem.sort = sort;

              })
            ).subscribe(response => {
              count++;
              if (count == personnage.sorts.length) {

                // Filter duplicated
                personnage.sorts = personnage.sorts.filter((sort, index, self) =>
                  index === self.findIndex((d) => (
                    d.sortRef === sort.sortRef
                  ))
                )

                resolve(personnage);
              }
            });
          } else {
            count++;
            if (count == personnage.sorts.length) {

              personnage.sorts = personnage.sorts.filter((sort, index, self) =>
                index === self.findIndex((d) => (
                  d.sortRef === sort.sortRef
                ))
              )

              resolve(personnage);
            }
          }

        }, error => {
          reject(error);
        });
      } else {
        resolve(personnage);
      }

    });

  }

  private getDons(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      // Retourne seulement la liste des dons du personnage
      let count: number = 0;
      if (!personnage.dons) personnage.dons = [];

      personnage.dons.forEach(donItem => {
        this.donService.getDonFiche(donItem.donRef).pipe(
          map(don => {

            donItem.don = don;

          })
        ).subscribe(response => {
          count++;
          if (count == personnage.dons.length) {
            resolve(personnage);
          }
        }, error => {
          reject(personnage);
        });
      });

    });

  }

  private getAllDons(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

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
      if (personnage.fourberies && personnage.fourberies.length > 0) {
        personnage.fourberies.forEach(fourberie => {
          if (fourberie.fourberie && fourberie.fourberie.donsEquivalentRef && fourberie.fourberie.donsEquivalentRef.length > 0) {
            fourberie.fourberie.donsEquivalentRef.forEach(aptDonRef => {
              let donItem: DonItem = new DonItem();
              donItem.niveauObtention = fourberie.niveauObtention;
              donItem.donRef = aptDonRef;
              personnage.dons.push(donItem);
            });
          }
        })
      }

      // Dons Aptitudes (Équivalence)
      if (personnage.aptitudes && personnage.aptitudes.length > 0) {
        personnage.aptitudes.forEach(aptitude => {
          if (aptitude.aptitude.donsEquivalentRef && aptitude.aptitude.donsEquivalentRef.length > 0) {
            aptitude.aptitude.donsEquivalentRef.forEach(aptDonRef => {
              let donItem: DonItem = new DonItem();
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

        personnage.dons.forEach(donItem => {

          if (!donItem.don) { //Avoid fetching Don if already fetch
            this.donService.getDonFiche(donItem.donRef).pipe(
              map(don => {

                donItem.don = don;

              })
            ).subscribe(response => {
              count++;
              if (count == personnage.dons.length) {

                // Filter duplicated
                personnage.dons = personnage.dons.filter((don, index, self) =>
                  index === self.findIndex((d) => (
                    d.donRef === don.donRef
                  ))
                )

                resolve(personnage);
              }
            }, error => {
              reject(error);
            });

          } else {
            count++;
            if (count == personnage.dons.length) {

              // Filter duplicated
              personnage.dons = personnage.dons.filter((don, index, self) =>
                index === self.findIndex((d) => (
                  d.donRef === don.donRef
                ))
              )

              resolve(personnage);
            }
          }

        });

      } else {
        resolve(personnage);
      }

    });

  }

  private getStatistiquesParDefault(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve) => {

      Promise.all([

        new Promise((resolve) => {
          let constitution: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("OdzM6YHkYw41HXMIcTsw").subscribe(response => {
            constitution.statistique = response;
            constitution.valeur = 0;
            personnage.statistiques.push(constitution);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let dexterite: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("oFeJq3NgdDDEwi0Y1rdR").subscribe(response => {
            dexterite.statistique = response;
            dexterite.valeur = 0;
            personnage.statistiques.push(dexterite);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let force: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("gOg0TFSbU8mvlv8baCXE").subscribe(response => {
            force.statistique = response;
            force.valeur = 0;
            personnage.statistiques.push(force);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let intelligence: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("yKfNuFBQY5UknrTNOxpA").subscribe(response => {
            intelligence.statistique = response;
            intelligence.valeur = 0;
            personnage.statistiques.push(intelligence);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let sagesse: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("HkaChqWpHOlINdla02ja").subscribe(response => {
            sagesse.statistique = response;
            sagesse.valeur = 0;
            personnage.statistiques.push(sagesse);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let pvTorse: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("sCcNIQDoWKUIIcSpkB2m").subscribe(response => {
            pvTorse.statistique = response;
            pvTorse.valeur = 3;
            personnage.statistiques.push(pvTorse);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let pvBras: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("ZSnV9s6cyzYihdFR6wfr").subscribe(response => {
            pvBras.statistique = response;
            pvBras.valeur = 2;
            personnage.statistiques.push(pvBras);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let pvJambes: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("69jKTq64XUCk51EmY0Z1").subscribe(response => {
            pvJambes.statistique = response;
            pvJambes.valeur = 2;
            personnage.statistiques.push(pvJambes);
            resolve(personnage);
          })
        }),

        new Promise((resolve) => {
          let lutte: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("Rp8BG8OtlNKl8aeuojdi").subscribe(response => {
            lutte.statistique = response;
            lutte.valeur = 3;
            personnage.statistiques.push(lutte);
            resolve(personnage);
          })

        }),

        new Promise((resolve) => {
          let mana: StatistiqueValue = new StatistiqueValue();
          this.statistiqueService.getStatistique("3f75skgSz3CWqdERXcqG").subscribe(response => {
            mana.statistique = response;
            mana.valeur = 0;
            personnage.statistiques.push(mana);
            resolve(personnage);
          })
        })
      ]).then(results => {
        resolve(personnage);
      }).catch(error => {
        rejects(error);
      });

    });

  }

  private getStatistiques(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      //Race Statistiques
      if (personnage.race.statistiques) {

        personnage.race.statistiques.forEach(statistiqueItem => {

          let found: boolean = false;

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

            if (!personnage.statistiques) {
              personnage.statistiques = [];
            }

            let statistique: StatistiqueValue = new StatistiqueValue();
            statistique.statistique = statistiqueItem.statistique;
            statistique.valeur = statistiqueItem.valeur;
            personnage.statistiques.push(statistique);

          }

        })
      }

      //Classe Statistiques
      if (personnage.classes && personnage.classes.length > 0) {
        personnage.classes.forEach(classeItem => {

          if (classeItem.classe && classeItem.classe.statistiques) {
            classeItem.classe.statistiques.forEach(statistiqueItem => {

              let found: boolean = false;

              if (personnage.statistiques) {
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

                if (!personnage.statistiques) {
                  personnage.statistiques = [];
                }

                let statistique: StatistiqueValue = new StatistiqueValue();
                statistique.statistique = statistiqueItem.statistique;
                statistique.valeur = statistiqueItem.valeur;
                personnage.statistiques.push(statistique);

              }

            })
          }

        })

      }

      //Aptitude Statistiques
      if (personnage.aptitudes) {

        personnage.aptitudes.forEach(aptitudeItem => {
          aptitudeItem.aptitude.statistiques.forEach(aptitudeStatistiqueItem => {

            let found: boolean = false;

            if (personnage.statistiques) {
              personnage.statistiques.forEach(personnageStatistiqueItem => {

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

                  found = true;
                }
              })
            }

            if (!found) {

              if (!personnage.statistiques) {
                personnage.statistiques = [];
              }

              let statistique: StatistiqueValue = new StatistiqueValue();
              statistique.statistique = aptitudeStatistiqueItem.statistique;
              statistique.valeur = aptitudeStatistiqueItem.valeur;
              personnage.statistiques.push(statistique);

            }

          })

        })
      }

      //Don Statistiques
      if (personnage.dons) {

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
        if (statistiqueValue.statistique.id == 'OdzM6YHkYw41HXMIcTsw') {
          personnage.statistiques.forEach(statistiqueValueUpdate => {

            //Modificateur de point de vie
            if (
              statistiqueValueUpdate.statistique.id == 'sCcNIQDoWKUIIcSpkB2m' || //PV Torse
              statistiqueValueUpdate.statistique.id == 'ZSnV9s6cyzYihdFR6wfr' || //PV Bras
              statistiqueValueUpdate.statistique.id == '69jKTq64XUCk51EmY0Z1'    // PV Jambes
            ) {
              statistiqueValueUpdate.valeur += statistiqueValue.valeur;
            }

          })
        }

        //Modificateur de Lutte
        if (statistiqueValue.statistique.id == 'gOg0TFSbU8mvlv8baCXE' || statistiqueValue.statistique.id == 'oFeJq3NgdDDEwi0Y1rdR') { //Force ou Dextérité
          personnage.statistiques.forEach(statistiqueValueUpdate => {

            //Modificateur de Lutte
            if (statistiqueValueUpdate.statistique.id == 'Rp8BG8OtlNKl8aeuojdi') {
              statistiqueValueUpdate.valeur += statistiqueValue.valeur;
            }

          })
        }

        //Modificateur de Mana
        if (statistiqueValue.statistique.id == '3f75skgSz3CWqdERXcqG') {


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
              if (statistiqueValueUpdate.statistique.id == 'yKfNuFBQY5UknrTNOxpA') {

                manaProfane += statistiqueValueUpdate.valeur;

                if (statistiqueValueUpdate.valeur == 1) {
                  manaProfane = Math.round((personnage.niveauProfane / 2) + manaProfane);
                }
                if (statistiqueValueUpdate.valeur > 1) {
                  manaProfane = Math.round(((personnage.niveauProfane + 1) / 2) + manaProfane);
                }

              }

              //Sagesse
              if (statistiqueValueUpdate.statistique.id == 'HkaChqWpHOlINdla02ja') {
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
          statistiqueValue.statistique.id == 'sCcNIQDoWKUIIcSpkB2m' || //PV Torse
          statistiqueValue.statistique.id == 'ZSnV9s6cyzYihdFR6wfr' || //PV Bras
          statistiqueValue.statistique.id == '69jKTq64XUCk51EmY0Z1'    // PV Jambes
        ) {
          if (statistiqueValue.valeur <= 0) {
            statistiqueValue.valeur = 1;
          }
        }

        //Correcteur de Lutte
        if (statistiqueValue.statistique.id == 'Rp8BG8OtlNKl8aeuojdi') {
          if (statistiqueValue.valeur < 0) {
            statistiqueValue.valeur = 0;
          }
        }

        //Correcteur de Mana
        if (statistiqueValue.statistique.id == '3f75skgSz3CWqdERXcqG') {
          if (manaProfane >= manaDivine) {
            statistiqueValue.valeur = manaProfane;
          } else {
            statistiqueValue.valeur = manaDivine;
          }
        }

      });

      resolve(personnage);

    });

  }

  private getResistances(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

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

      resolve(personnage);

    });

  }

  private getImmunites(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      if (!personnage.immunites) personnage.immunites = [];

      //Race Immunites
      if (personnage.race.immunites) {
        personnage.immunites = [...personnage.immunites, ...personnage.race.immunites];
      }

      //Classes Immunites
      if (personnage.classes && personnage.classes.length > 0) {
        personnage.classes.forEach(classeItem => {
          if (classeItem.classe.immunites) {
            personnage.immunites = [...personnage.immunites, ...classeItem.classe.immunites];
          }
        })
      }

      //Aptitudes Immunites
      if (personnage.aptitudes) {
        personnage.aptitudes.forEach(aptitudeItem => {
          if (aptitudeItem.aptitude && aptitudeItem.aptitude.immunites) {
            personnage.immunites = [...personnage.immunites, ...aptitudeItem.aptitude.immunites];
          }
        })
      }

      //Dons Immunites
      if (personnage.dons) {
        personnage.dons.forEach(donItem => {
          if (donItem.don && donItem.don.immunites) {
            personnage.immunites = [...personnage.immunites, ...donItem.don.immunites];
          }
        })
      }

      resolve(personnage);

    });

  }

  private getDonsNiveauEffectif(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

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
      resolve(personnage);

    });

  }

  private getCapaciteSpeciales(personnage: Personnage): Promise<Personnage> {

    return new Promise((resolve, reject) => {

      if (!personnage.capaciteSpeciales) personnage.capaciteSpeciales = [];
      personnage.statistiques.forEach(statistiqueValue => {
        let found: boolean = false;
        StatistiquesIds.forEach(statistiqueMap => {
          if (statistiqueMap.id == statistiqueValue.statistique.id) {
            found = true;
          }
        })
        if (!found) {
          personnage.capaciteSpeciales.push(statistiqueValue);
        }
      })

      resolve(personnage);

    });

  }

  //#endregion

}