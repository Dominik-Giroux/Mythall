import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EcoleService, IEcole } from './ecole.service';
import { PorteService, IPorte } from './porte.service';
import { DureeService, IDuree } from './duree.service';
import { ZoneService, IZone } from './zone.service';
import { IPersonnage } from './personnage.service';

export interface ISort extends ISortDB {
  id: string;
  ecole: IEcole;
  porte: IPorte;
  duree: IDuree;
  zone: IZone;
}

export interface ISortDB {
  nom: string;
  niveau: string;
  incantation: string;
  sommaire: string;
  description: string;
  ecoleRef: string;
  porteRef: string;
  dureeRef: string;
  zoneRef: string;
}

export class SortItem {
  constructor() {
    this.sort = null;
    this.sortRef = '';
    this.niveauObtention = 1;
  }
  sort: ISort;
  sortRef: string;
  niveauObtention: number;
}

@Injectable()
export class SortService {

  constructor(
    private afs: AngularFirestore,
    private ecoleService: EcoleService,
    private porteService: PorteService,
    private dureeService: DureeService,
    private zoneService: ZoneService
  ) { }

  public async getSorts(): Promise<ISort[]> {
    return (await this.afs.collection<ISort>('sorts').ref.orderBy('nom').get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as ISort;
      })
      .sort((a: ISort, b: ISort) => {
        return a.nom.localeCompare(b.nom);
      })
  }

  public async getSort(id: string): Promise<ISort> {
    const data = await this.afs.doc<ISort>(`sorts/${id}`).ref.get();
    let sort = {
      id: data.id,
      ...data.data()
    } as ISort;

    sort.ecole = await this.ecoleService.getEcole(sort.ecoleRef);
    sort.porte = await this.porteService.getPorte(sort.porteRef);
    sort.duree = await this.dureeService.getDuree(sort.dureeRef);
    sort.zone = await this.zoneService.getZone(sort.zoneRef);

    return sort;
  }

  public async addSort(sort: ISort): Promise<ISort> {
    const data = await this.afs.collection(`sorts`).add(this._saveState(sort));
    return { id: data.id, ...sort } as ISort;
  }

  public async updateSort(sort: ISort): Promise<ISort> {
    await this.afs.doc<ISort>(`sorts/${sort.id}`).update(this._saveState(sort));
    return sort;
  }

  public async deleteSort(id: string): Promise<boolean> {
    await this.afs.doc<ISort>(`sorts/${id}`).delete();
    return true;
  }

  public async getAvailableSorts(personnage: IPersonnage): Promise<ISort[]> {

    let list: ISort[] = [];

    // Get list de sort disponible
    if (personnage.classes) {
      personnage.classes.forEach((classe) => {
        classe.classe.sortsDisponible.forEach(async (sortDispo) => {
          if (sortDispo.niveauObtention <= classe.niveau) {
            list.push(await this.getSort(sortDispo.sortRef));
          }
        });
      });
    }

    // Filtre les sorts déjà existant
    if (personnage?.sorts?.length) {
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

    return list;
  }

  public async getPersonnageSorts(personnage: IPersonnage): Promise<IPersonnage> {

    if (!personnage.sorts) personnage.sorts = [];

    // Sorts Classes
    if (personnage?.classes?.length) {
      personnage.classes.forEach(classeItem => {
        if (classeItem?.classe?.sorts?.length) {
          classeItem.classe.sorts.forEach(sortItem => {
            if (classeItem.niveau >= sortItem.niveauObtention) {
              personnage.sorts.push(sortItem);
            }
          })
        }
      });
    }

    // Sorts Domaines
    if (personnage?.domaines?.length) {
      personnage.domaines.forEach(domaine => {
        if (domaine?.sorts?.length) {
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
    if (personnage?.esprit?.sorts?.length) {
      personnage.esprit.sorts.forEach(sortItem => {
        personnage.classes.forEach(classe => {
          if (classe.classeRef == 'wW48swrqmr77awfyADMX' && classe.niveau >= sortItem.niveauObtention) {
            personnage.sorts.push(sortItem);
          }
        })
      })
    };

    // Sorts Aptitudes (Équivalence)
    if (personnage?.aptitudes?.length) {
      personnage.aptitudes.forEach(aptitudeItem => {
        if (aptitudeItem?.aptitude?.sortsEquivalentRef?.length) {
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
    if (personnage?.sorts?.length) {
      await Promise.all(
        personnage.sorts.map(async (sortItem) => {
          sortItem.sort = await this.getSort(sortItem.sortRef);
        })
      );
    }

    // Filter duplicated
    personnage.sorts = personnage.sorts.filter((sort, index, self) =>
      index === self.findIndex((d) => (
        d.sortRef === sort.sortRef
      ))
    )

    return personnage;
  }

  private _saveState(item: ISort): ISortDB {
    return {
      nom: item.nom,
      niveau: item.niveau,
      incantation: item.incantation,
      sommaire: item.sommaire,
      description: item.description,
      ecoleRef: item.ecoleRef,
      porteRef: item.porteRef,
      dureeRef: item.dureeRef,
      zoneRef: item.zoneRef,
    };
  }

}