export class Resistance {

    constructor() {
    }

    id: string;
    nom: string;

    saveState(): any {

        var resistance: any = {
            nom: this.nom
        };

        return resistance;
    }

}

export class ResistanceItem {

    constructor() {
        this.resistance = null;
        this.resistanceRef = '';
        this.niveau = 1;
        this.valeur = 0;
        this.cummulable = false;
    }

    resistance: Resistance;
    resistanceRef: string;
    niveau: number;
    valeur: number;
    cummulable: boolean;
}


export class ResistanceValue {

    constructor() {
        this.resistance = null;
        this.valeur = 0;
    }

    resistance: Resistance;
    valeur: number;
}