import { Alignement } from "./alignement";
import { Domaine } from "../services/domaines/models/domaine";

export class Dieu {

    constructor() {
        this.alignementPermis = [];
        this.domaines = [];
    }

    id: string;
    nom: string;
    prononciation: string;
    titre: string;
    rang: string;
    alignement: Alignement;
    alignementRef: string;
    alignementPermis: Alignement[];
    alignementPermisRef: string[];
    domaines: Domaine[];
    domainesRef: string[];
    armeDePredilection: string;
    relations: string;
    dogmes: string;

    map(data, id?): Dieu {
        var item: Dieu = new Dieu();
        id ? item.id = id : '';
        for (var key in data) {
            item[key] = data[key]
        }
        return item;
    }

    saveState(): any {

        var dieu: any = {
            nom: this.nom,
            prononciation: this.prononciation,
            titre: this.titre,
            rang: this.rang,
            alignementRef: this.alignementRef,
            alignementPermisRef: this.alignementPermisRef,
            domainesRef: this.domainesRef,
            armeDePredilection: this.armeDePredilection,
            relations: this.relations,
            dogmes: this.dogmes
        };

        return Object.assign({}, dieu);
    }

}