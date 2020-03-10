import { DonItem } from "../../dons/models/don";
import { SortItem } from "../../sorts/models/sort";
import { AptitudeItem } from "../../aptitudes/models/aptitude";

export class Esprit {

    constructor() {
        this.aptitudes = [];
        this.dons = [];
        this.sorts = [];
    }

    id: string;
    nom: string;
    description: string;
    aptitudes: AptitudeItem[];
    dons: DonItem[];
    sorts: SortItem[];
    
    saveState(): any {

        if(!this.aptitudes) this.aptitudes = [];
        if(!this.dons) this.dons = [];
        if(!this.sorts) this.sorts = [];

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

        var esprit: any = {
            nom: this.nom,
            description: this.description,
            aptitudes: this.aptitudes.map((obj)=> {return Object.assign({}, obj)}),
            dons: this.dons.map((obj)=> {return Object.assign({}, obj)}),
            sorts: this.sorts.map((obj)=> {return Object.assign({}, obj)}),
        };

        console.log(esprit);
        return esprit;
    }

}