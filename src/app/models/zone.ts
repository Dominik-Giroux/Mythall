export class Zone {

    constructor() {
    }

    id: string;
    nom: string;

    saveState(): any {

        var zone: any = {
            nom: this.nom,
        };

        return Object.assign({}, zone);
    }

}