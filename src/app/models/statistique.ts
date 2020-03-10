export class Statistique {

    constructor(){
    }

    id: string;
    nom: string;

    saveState(): any{

        var statistique: any = {
            nom: this.nom
        };
        
        return Object.assign({}, statistique);
    }

}

export class StatistiqueItem {

    constructor(){
        this.statistique = null;
        this.statistiqueRef = '';
        this.niveau = 1;
        this.valeur = 0;
        this.cummulable = false;
    }

    statistique: Statistique;
    statistiqueRef: string;
    niveau: number;
    valeur: number;
    cummulable: boolean;
}

export class StatistiqueValue {

    constructor(){
        this.statistique = null;
        this.valeur = 0;
    }

    statistique: Statistique;
    valeur: number;
}