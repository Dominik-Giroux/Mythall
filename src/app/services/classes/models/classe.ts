import { Alignement } from "../../../models/alignement";
import { AptitudeItem } from "../../aptitudes/models/aptitude";
import { DonItem } from "../../dons/models/don";
import { SortItem } from "../../sorts/models/sort";
import { Choix } from "../../personnages/models/choix";
import { StatistiqueItem } from "../../../models/statistique";
import { ResistanceItem } from "../../../models/resistance";
import { Immunite } from "../../../models/immunite";

export class Classe {

    constructor() {
        this.alignementPermis = [];
        this.multiclassement = [];
        this.aptitudes = [];
        this.dons = [];
        this.sorts = [];
        this.sortsDisponible = [];
        this.choix = [];
        this.statistiques = [];
        this.resistances = [];
        this.immunites = [];
        this.prestige = false;
    }

    id: string;
    nom: string;
    description: string;
    obligations: string;
    avantages: string;
    desavantages: string;
    alignementPermis: Alignement[];
    alignementPermisRef: string[];
    multiclassement: Classe[];
    multiclassementRef: string[];
    aptitudes: AptitudeItem[];
    dons: DonItem[];
    sorts: SortItem[];
    sortsDisponible: SortItem[];
    choix: Choix[];
    statistiques: StatistiqueItem[];
    resistances: ResistanceItem[];
    immunites: Immunite[];
    immunitesRef: string[];
    type: string;
    sort: string;
    prestige: boolean;

    saveState(): any {

        if (!this.aptitudes) this.aptitudes = [];
        if (!this.dons) this.dons = [];
        if (!this.sorts) this.sorts = [];
        if (!this.sortsDisponible) this.sortsDisponible = [];
        if (!this.choix) this.choix = [];
        if (!this.resistances) this.resistances = [];
        if (!this.statistiques) this.statistiques = [];
        if (!this.immunitesRef) this.immunitesRef = [];
        if (!this.prestige) this.prestige = false;

        //Filter Out
        this.aptitudes.forEach(aptitude => {
            aptitude.aptitude = null;
        });

        this.dons.forEach(don => {
            don.don = null;
        });

        this.sorts.forEach(sort => {
            sort.sort = null;
        });

        this.sortsDisponible.forEach(sort => {
            sort.sort = null;
        });

        this.resistances.forEach(resistance => {
            resistance.resistance = null;
        });
        this.statistiques.forEach(statistique => {
            statistique.statistique = null;
        });

        var classe: any = {
            nom: this.nom,
            description: this.description,
            obligations: this.obligations,
            avantages: this.avantages,
            desavantages: this.desavantages,
            alignementPermisRef: this.alignementPermisRef,
            multiclassementRef: this.multiclassementRef,
            aptitudes: this.aptitudes.map((obj) => { return Object.assign({}, obj) }),
            dons: this.dons.map((obj) => { return Object.assign({}, obj) }),
            sorts: this.sorts.map((obj) => { return Object.assign({}, obj) }),
            sortsDisponible: this.sortsDisponible.map((obj) => { return Object.assign({}, obj) }),
            choix: this.choix.map((obj) => { return Object.assign({}, obj) }),
            statistiques: this.statistiques.map((obj) => { return Object.assign({}, obj) }),
            resistances: this.resistances.map((obj) => { return Object.assign({}, obj) }),
            immunitesRef: this.immunitesRef,
            type: this.type,
            sort: this.sort,
            prestige: this.prestige
        };

        console.log(classe);
        return classe;
    }

}

export const ClasseTypes = [
    'Combatant',
    'Lanceur de Sort'
]

export const ClasseSort = [
    'Divin',
    'Profane'
]

export class ClasseItem {

    constructor() {
        this.classe = null;
        this.classeRef = '';
        this.niveau = 1;
    }

    classe: Classe;
    classeRef: string;
    niveau: number;
}

export class ClasseAuthorise {

    constructor() {
        this.classe = null;
        this.classeRef = '';
        this.niveau = 1;
    }

    classe: Classe;
    classeRef: string;
    niveau: number;
}