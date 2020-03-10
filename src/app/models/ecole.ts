export class Ecole{

    constructor(){
    }

    id: string;
    nom: string;

    saveState(): any{

        var ecole: any = {
            nom: this.nom,
        };

        return Object.assign({}, ecole);
    }

}