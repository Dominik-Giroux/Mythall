import { StatistiqueItem } from "../../../models/statistique";
import { ResistanceItem } from "../../../models/resistance";
import { Immunite } from "../../../models/immunite";
import { Don } from "../../dons/models/don";
import { Choix } from "../../personnages/models/choix";

export class Aptitude {

    constructor() {
        this.statistiques = [];
        this.resistances = [];
        this.immunites = [];
    }

    id: string;
    nom: string;
    description: string;
    donsEquivalent: Don[];
    donsEquivalentRef: string[];
    sortsEquivalent: Don[];
    sortsEquivalentRef: string[];
    immunites: Immunite[];
    immunitesRef: string[];
    resistances: ResistanceItem[];
    statistiques: StatistiqueItem[];
    choix: Choix[];

    map(data, id?) {
        id ? this.id = id : '';
        for (var key in data) {
            this[key] = data[key]
        }
    }

    saveState(): any {

        if (!this.donsEquivalentRef) this.donsEquivalentRef = [];
        if (!this.sortsEquivalentRef) this.sortsEquivalentRef = [];
        if (!this.immunitesRef) this.immunitesRef = [];
        if (!this.resistances) this.resistances = [];
        if (!this.statistiques) this.statistiques = [];
        if (!this.choix) this.choix = [];

        //Filter Out
        this.resistances.forEach(resistance => {
            resistance.resistance = null;
        });
        this.statistiques.forEach(statistique => {
            statistique.statistique = null;
        });

        var aptitude: any = {
            nom: this.nom,
            description: this.description,
            donsEquivalentRef: this.donsEquivalentRef,
            sortsEquivalentRef: this.sortsEquivalentRef,
            immunitesRef: this.immunitesRef,
            resistances: this.resistances.map((obj) => { return Object.assign({}, obj) }),
            statistiques: this.statistiques.map((obj) => { return Object.assign({}, obj) }),
            choix: this.choix.map((obj) => { return Object.assign({}, obj) })
        };

        console.log(aptitude);
        return aptitude;
    }

}

export class AptitudeItem {
    constructor() {
        this.aptitude = null;
        this.aptitudeRef = '';
        this.niveauObtention = 1;
    }

    aptitude: Aptitude;
    aptitudeRef: string;
    niveauObtention: number;
}