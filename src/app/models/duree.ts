export class Duree {

    constructor(){
    }

    id: string;
    nom: string;

    saveState(): any{

        var duree: any = {
            nom: this.nom,
        };

        return Object.assign({}, duree);
    }

}