export class Choix {

    constructor() {

        this.type = '';
        this.quantite = 1;
        this.niveauObtention = 0;
        this.ref = [];
    }

    type: string;
    quantite: number;
    niveauObtention: number;
    categorie?: string;
    domaine: boolean;
    ref: string[]; // Référence pour choix de don, sort, aptitude, fourberie
}

export const ChoixTypes: string[] = [
    'aptitude',
    'connaissance',
    'don',
    'domaine',
    'ecole',
    'esprit',
    'fourberie',
    'ordre',
    'sort'
]