export class Build {

    constructor(){
        this.user = new BuildProgress();
        this.classes = new BuildProgress();
        this.race = new BuildProgress();
        this.alignement = new BuildProgress();
        this.divinite = new BuildProgress();
        this.ordres = new BuildProgress();
        this.niveauEffectif = new BuildProgress();
        this.domaines = new BuildProgress();
        this.esprit = new BuildProgress();
        this.fourberies = new BuildProgress();
        this.aptitudes = new BuildProgress();
        this.sorts = new BuildProgress();        
        this.dons = new BuildProgress();
        this.statistiques = new BuildProgress();
        this.statistiquesParDefault = new BuildProgress();
        this.resistances = new BuildProgress();
        this.immunites = new BuildProgress();    
        this.donsNiveauEffectif = new BuildProgress();
        this.capaciteSpeciales = new BuildProgress();
    }

    user: BuildProgress;
    classes: BuildProgress;
    race: BuildProgress;
    alignement: BuildProgress;
    divinite: BuildProgress;
    ordres: BuildProgress;
    niveauEffectif: BuildProgress;
    domaines: BuildProgress;
    esprit: BuildProgress;
    fourberies: BuildProgress;
    aptitudes: BuildProgress;
    sorts: BuildProgress;    
    dons: BuildProgress;
    statistiques: BuildProgress;
    statistiquesParDefault: BuildProgress;
    resistances: BuildProgress;
    immunites: BuildProgress;    
    donsNiveauEffectif: BuildProgress;
    capaciteSpeciales: BuildProgress;
}

export class BuildProgress {

    constructor(){
        this.completed = false;
        this.inProgress = false;
    }

    completed: boolean;
    inProgress: boolean;

}