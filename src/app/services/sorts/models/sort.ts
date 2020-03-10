import { Ecole } from "../../../models/ecole";
import { Porte } from "../../../models/porte";
import { Duree } from "../../../models/duree";
import { Zone } from "../../../models/zone";

export class Sort{

    constructor(){
    }

    id: string;
    nom: string;
    niveau: string;
    incantation: string;
    sommaire: string;
    description: string;
    ecole: Ecole;
    ecoleRef: string;
    porte: Porte;
    porteRef: string;
    duree: Duree;
    dureeRef: string;
    zone: Zone;
    zoneRef: string;

    saveState(): any{

        var sort: any = {
            nom: this.nom,
            niveau: this.niveau,
            incantation: this.incantation,
            sommaire: this.sommaire,
            description: this.description,
            ecoleRef: this.ecoleRef,
            porteRef: this.porteRef,
            dureeRef: this.dureeRef,
            zoneRef: this.zoneRef,
        };

        console.log(sort);
        return sort;
    }

}

export class SortItem {
    constructor(){
        this.sort = null;
        this.sortRef = '';
        this.niveauObtention = 1;
    }

    sort: Sort;
    sortRef: string;
    niveauObtention: number;
}