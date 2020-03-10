export class Immunite {

    constructor() {
    }

    id: string;
    nom: string;

    saveState(): any {

        var immunite: any = {
            nom: this.nom
        };

        return Object.assign({}, immunite);
    }

}