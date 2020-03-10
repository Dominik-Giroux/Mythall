import { Classe } from "../../classes/models/classe";
import { Alignement } from "../../../models/alignement";

export class Ordre {

    constructor() {
        this.multiclassement = [];
        this.alignementPermis = [];    
    }

    id: string;
    nom: string;
    description: string;
    classeRef: string[];
    multiclassement: Classe[];
    multiclassementRef: string[];
    alignementPermis: Alignement[];
    alignementPermisRef: string[];

    saveState(): any {

        var ordre: any = {
            nom: this.nom,
            description: this.description,
            classeRef: this.classeRef,
            multiclassementRef: this.multiclassementRef,
            alignementPermisRef: this.alignementPermisRef
        };

        console.log(ordre);
        return ordre;
    }

}