import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AptitudeService, AptitudeItem } from './aptitude.service';
import { DonService, DonItem } from './don.service';
import { SortService, SortItem } from './sort.service';
import { ClasseService, IClasse } from './classe.service';
import { IAlignement } from './alignement.service';
import { IPersonnage } from './personnage.service';
import { Choix } from './choix.service';

export interface IDomaine extends IDomaineDB {
  id: string;
  domaineContraire: IDomaine;
  alignementPermis: IAlignement[];
  multiclassement: IClasse[];
}

export interface IDomaineDB {
  nom: string;
  bonus: string;
  domaineContraireRef: string;
  alignementPermisRef: string[];
  multiclassementRef: string[];
  aptitudes: AptitudeItem[];
  dons: DonItem[];
  sorts: SortItem[];
  choix: Choix[];
}

@Injectable()
export class DomaineService {

  constructor(
    private afs: AngularFirestore,
    private aptitudeService: AptitudeService,
    private classeService: ClasseService,
    private donService: DonService,
    private sortService: SortService
  ) { }

  public async getDomaines(): Promise<IDomaine[]> {
    return (await this.afs.collection<IDomaine>('domaines').ref.orderBy('nom').get()).docs
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IDomaine;
      })
      .sort((a: IDomaine, b: IDomaine) => {
        return a.nom.localeCompare(b.nom);
      })
  }

  public async getDomaine(id: string, full?: boolean): Promise<IDomaine> {
    const data = await this.afs.doc<IDomaine>(`domaines/${id}`).ref.get();
    let domaine = {
      id: data.id,
      ...data.data()
    } as IDomaine;

    if (full) {
      await Promise.all([
        this._getClasses(domaine),
        this._getDomaineContraire(domaine),
        this._getAptitudees(domaine),
        this._getSorts(domaine),
        this._getDons(domaine),
      ]);
    }

    return domaine;
  }

  public async addDomaine(domaine: IDomaine): Promise<IDomaine> {
    const data = await this.afs.collection(`domaines`).add(this._saveState(domaine));
    return { id: data.id, ...domaine } as IDomaine;
  }

  public async updateDomaine(domaine: IDomaine): Promise<IDomaine> {
    await this.afs.doc<IDomaine>(`domaines/${domaine.id}`).update(this._saveState(domaine));
    return domaine;
  }

  public async deleteDomaine(id: string): Promise<boolean> {
    await this.afs.doc<IDomaine>(`domaines/${id}`).delete();
    return true;
  }

  public async getAvailableDomaines(personnage: IPersonnage): Promise<IDomaine[]> {

    let list = await this.getDomaines();

    // Filtre selon l'alignement du personnage
    if (personnage.alignementRef) {
      list = list.filter((domaine) => {
        return domaine.alignementPermisRef.includes(personnage.alignementRef);
      });
    }

    // Filtre selon les domaines du personnage
    if (personnage?.domaines?.length) {
      personnage.domaines.forEach(domainePersonnage => {

        // Filtre domaine existant
        list = list.filter((domaine) => {
          return domaine.id != domainePersonnage.id;
        });

        // Filtre domaine oposé
        list = list.filter((domaine) => {
          return domaine.id != domainePersonnage.domaineContraireRef;
        });

      });
    }

    return list;
  }

  public async getPersonnageDomaines(personnage: IPersonnage): Promise<IPersonnage> {
    if (personnage?.domainesRef) {
      await Promise.all(
        personnage.domainesRef.map(async (domaineRef) => {
          const domaine = await this.getDomaine(domaineRef);
          if (!personnage.domaines) personnage.domaines = [];
          personnage.domaines.push(domaine);
        })
      );
    }
    return personnage;
  }


  private _saveState(item: IDomaine): IDomaineDB {
    if (!item.aptitudes) item.aptitudes = [];
    if (!item.dons) item.dons = [];
    if (!item.sorts) item.sorts = [];
    if (!item.choix) item.choix = [];

    //Filter Out
    item.aptitudes.forEach(aptitude => {
      aptitude.aptitude = null;
    });

    item.dons.forEach(don => {
      don.don = null;
    });

    item.sorts.forEach(sort => {
      sort.sort = null;
    });

    return {
      nom: item.nom,
      bonus: item.bonus,
      domaineContraireRef: item.domaineContraireRef,
      alignementPermisRef: item.alignementPermisRef,
      multiclassementRef: item.multiclassementRef,
      aptitudes: item.aptitudes.map((obj) => { return { ...obj } }),
      dons: item.dons.map((obj) => { return { ...obj } }),
      sorts: item.sorts.map((obj) => { return { ...obj } }),
      choix: item.choix.map((obj) => { return { ...obj } }),
    };
  }

  private async _getDomaineContraire(domaine: IDomaine): Promise<void> {
    domaine.domaineContraire = await this.getDomaine(domaine.domaineContraireRef);
  }

  private async _getClasses(domaine: IDomaine): Promise<void> {
    if (domaine?.multiclassementRef?.length) {
      await Promise.all(
        domaine.multiclassementRef.map(async (classeRef) => {
          const classe = await this.classeService.getClasse(classeRef);
          if (!domaine.multiclassement) domaine.multiclassement = [];
          domaine.multiclassement.push(classe);
        })
      );
    }
  }

  private async _getAptitudees(domaine: IDomaine): Promise<void> {
    if (domaine?.aptitudes?.length) {
      await Promise.all(
        domaine.aptitudes.map(async (aptitudeItem) => {
          aptitudeItem.aptitude = await this.aptitudeService.getAptitude(aptitudeItem.aptitudeRef);
        })
      );
    }
  }

  private async _getDons(domaine: IDomaine): Promise<void> {
    if (domaine?.dons?.length) {
      await Promise.all(
        domaine.dons.map(async (donItem) => {
          donItem.don = await this.donService.getDon(donItem.donRef);
        })
      );
    }
  }

  private async _getSorts(domaine: IDomaine): Promise<void> {
    if (domaine?.sorts?.length) {
      await Promise.all(
        domaine?.sorts.map(async (sortItem) => {
          sortItem.sort = await this.sortService.getSort(sortItem.sortRef);
        })
      );
    }
  }

}