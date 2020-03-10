import { Classe } from "../../classes/models/classe";
import { Statistique, StatistiqueItem } from "../../../models/statistique";
import { Resistance, ResistanceItem } from "../../../models/resistance";
import { Immunite } from "../../../models/immunite";
import { Sort } from "../../sorts/models/sort";
import { Don } from "../../dons/models/don";
import { Aptitude } from "../../aptitudes/models/aptitude";
import { Alignement } from "../../../models/alignement";

export class Race {

    constructor() {
        this.classesDisponible = [];
        this.alignementPermis = [];   
        this.ajustement = 0;
        this.statistiques = [];
        this.resistances = [];
        this.immunites = [];
        this.sortsRacial = [];
        this.donsRacial = [];
    }

    id: string;
    nom: string;
    description: string;
    obligations: string;
    avantages: string;
    desavantages: string;
    alignementPermis: Alignement[];
    alignementPermisRef: string[];
    classesDisponible: Classe[];
    classesDisponibleRef: string[];
    ajustement: number;
    statistiques: StatistiqueItem[];
    resistances: ResistanceItem[];
    immunites: Immunite[];
    immunitesRef: string[];
    sortsRacial: Sort[];
    sortsRacialRef: string[];
    donsRacial: Don[];
    donsRacialRef: string[];
    aptitudesRacial: Aptitude[];
    aptitudesRacialRef: string[];


    saveState(): any {

        if(!this.resistances) this.resistances = [];
        if(!this.statistiques) this.statistiques = [];
        if(!this.immunitesRef) this.immunitesRef = [];
        if(!this.sortsRacialRef) this.sortsRacialRef = [];
        if(!this.donsRacialRef) this.donsRacialRef = [];
        if(!this.aptitudesRacialRef) this.aptitudesRacialRef = [];

        //Filter Out
        this.resistances.forEach(resistance => {
            resistance.resistance = null;
        });
        this.statistiques.forEach(statistique => {
            statistique.statistique = null;
        });

        var race: any = {
            nom: this.nom,
            description: this.description,
            obligations: this.obligations,
            avantages: this.avantages,
            desavantages: this.desavantages,
            alignementPermisRef: this.alignementPermisRef,
            classesDisponibleRef: this.classesDisponibleRef,
            ajustement: this.ajustement,
            statistiques: this.statistiques.map((obj)=> {return Object.assign({}, obj)}),
            resistances: this.resistances.map((obj)=> {return Object.assign({}, obj)}),
            immunitesRef: this.immunitesRef,
            sortsRacialRef: this.sortsRacialRef,
            donsRacialRef: this.donsRacialRef,
            aptitudesRacialRef: this.aptitudesRacialRef
        };

        console.log(race);
        return race;
    }

}