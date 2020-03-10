export class Porte {

    constructor(){
    }

    id: string;
    nom: string;

    saveState(): any{

        var porte: any = {
            nom: this.nom,
        };

        return Object.assign({}, porte);
    }

}