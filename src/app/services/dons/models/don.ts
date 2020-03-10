import { StatistiqueItem, Statistique } from "../../../models/statistique";
import { ResistanceItem } from "../../../models/resistance";
import { Immunite } from "../../../models/immunite";
import { Race } from "../../races/models/race";
import { Classe, ClasseAuthorise } from "../../classes/models/classe";

export class Don {

    constructor() {
        this.niveauRequis = 0;
        this.nlsRequis = 0;
        this.niveauMaxObtention = 0;
        this.statistiques = [];
        this.resistances = [];
        this.immunites = [];
        this.classesAutorise = [];
    }

    id: string;
    nom: string;
    description: string;
    niveauRequis: number;
    nlsRequis: number;
    niveauMaxObtention: number;
    categorie: string;
    afficherNiveau: boolean;
    modificateur: Statistique[];
    modificateurRef: string[];
    modificateurs: Statistique[];
    modificateursRef: string[];
    classesAutorise: ClasseAuthorise[];
    donsRequis: Don[];
    donsRequisRef: string[];
    immunites: Immunite[];
    immunitesRef: string[];
    racesAutorise: Race[];
    racesAutoriseRef: string[];
    resistances: ResistanceItem[];
    statistiques: StatistiqueItem[];

    saveState(): any {

        if (!this.afficherNiveau) this.afficherNiveau = false;
        if (!this.classesAutorise) this.classesAutorise = [];
        if (!this.donsRequisRef) this.donsRequisRef = [];
        if (!this.immunitesRef) this.immunitesRef = [];
        if (!this.racesAutoriseRef) this.racesAutoriseRef = [];
        if (!this.resistances) this.resistances = [];
        if (!this.statistiques) this.statistiques = [];
        if (!this.modificateursRef) this.modificateursRef = [];

        //Filter Out
        this.classesAutorise.forEach(classe => {
            classe.classe = null;
        });
        this.resistances.forEach(resistance => {
            resistance.resistance = null;
        });
        this.statistiques.forEach(statistique => {
            statistique.statistique = null;
        });

        var don: any = {
            nom: this.nom,
            description: this.description,
            niveauRequis: this.niveauRequis,
            nlsRequis: this.nlsRequis,
            niveauMaxObtention: this.niveauMaxObtention,
            categorie: this.categorie,
            afficherNiveau: this.afficherNiveau,
            classesAutorise: this.classesAutorise.map((obj) => { return Object.assign({}, obj) }),
            donsRequisRef: this.donsRequisRef,
            immunitesRef: this.immunitesRef,
            racesAutoriseRef: this.racesAutoriseRef,
            resistances: this.resistances.map((obj) => { return Object.assign({}, obj) }),
            statistiques: this.statistiques.map((obj) => { return Object.assign({}, obj) }),
            modificateursRef: this.modificateursRef
        };

        console.log(don);
        return don;
    }

}

export class DonItem {
    constructor(){
        this.don = null;
        this.donRef = '';
        this.niveauObtention = 1;
        this.niveauEffectif = 1;
    }

    don: Don;
    donRef: string;
    niveauObtention: number;
    niveauEffectif: number;
}

export const DonCategories = ['Normal', 'Connaissance', 'Statistique', 'Résistance', 'Immunité', 'Maniement', 'Épique', 'Metamagie', 'Création', 'Spécialisation Martiale']