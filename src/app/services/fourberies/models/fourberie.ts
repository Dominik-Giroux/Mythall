import { Statistique } from "../../../models/statistique";
import { Don } from "../../dons/models/don";

export class Fourberie {

    constructor() {
    }

    id: string;
    nom: string;
    description: string;
    afficherNiveau: boolean;
    modificateur: Statistique;
    modificateurRef: string;
    fourberiesRequis: Fourberie[];
    fourberiesRequisRef: string[];    
    donsEquivalent: Don[];
    donsEquivalentRef: string[];

    saveState(): any {

        if (!this.afficherNiveau) this.afficherNiveau = false;
        if (!this.fourberiesRequisRef) this.fourberiesRequisRef = [];
        if (!this.donsEquivalentRef) this.donsEquivalentRef = [];

        var fourberie: any = {
            nom: this.nom,
            description: this.description,
            afficherNiveau: this.afficherNiveau,
            fourberiesRequisRef: this.fourberiesRequisRef,
            donsEquivalentRef: this.donsEquivalentRef,
        };

        if (this.modificateurRef) {
            fourberie.modificateurRef = this.modificateurRef;
        }

        console.log(fourberie);
        return fourberie;
    }

}

export class FourberieItem {
    constructor(){
        this.fourberie = null;
        this.fourberieRef = '';
        this.niveauObtention = 1;
        this.niveauEffectif = 1;
    }

    fourberie: Fourberie;
    fourberieRef: string;
    niveauObtention: number;
    niveauEffectif: number;
}