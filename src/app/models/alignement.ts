export class Alignement {

    constructor() {}

    id: string;
    nom: string;

    map(data, id?) {
        id ? this.id = id : '';
        for (var key in data) {
            this[key] = data[key]
        }
    }

    saveState(): any {

        var alignement: any = {
            nom: this.nom
        };

        return Object.assign({}, alignement);
    }

}