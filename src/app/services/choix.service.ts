import { Injectable } from '@angular/core';
import { IPersonnage } from './personnage.service';
import { ClasseItem } from './classe.service';

export class Choix {

  constructor() {
    this.type = '';
    this.quantite = 1;
    this.niveauObtention = 0;
    this.ref = [];
  }

  type: string;
  quantite: number;
  niveauObtention: number;
  categorie?: string;
  domaine: boolean;
  ref: string[]; // Référence pour choix de don, sort, aptitude, fourberie
}

export const ChoixTypes: string[] = [
  'aptitude',
  'connaissance',
  'don',
  'domaine',
  'ecole',
  'esprit',
  'fourberie',
  'ordre',
  'sort'
]

@Injectable()
export class ChoixService {

  constructor(
  ) { }

  public async getChoixPersonnage(personnage: IPersonnage, progressingClasse: ClasseItem): Promise<Choix[]> {

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

      listChoix.push({ ...don });

    }

    // Don Racial Elf
    if (personnage.raceRef == '5hteaYQ4K8J1MaAvU9Zh' && personnage.niveauReel == 1) {

      const don: Choix = new Choix();
      don.type = 'don';
      don.categorie = 'Connaissance';
      don.niveauObtention = 1;
      don.quantite = 1;

      listChoix.push({ ...don });

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

    return listChoix;

  }

  public getChoixClasse(personnage: IPersonnage, progressingClasse: ClasseItem): Choix[] {

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

    return listChoix;

  }

  public getChoixDomaine(personnage: IPersonnage, progressingClasse: ClasseItem): Choix[] {

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

    return listChoix;

  }

}