import { Alignement } from './alignement';
import { Ecole } from './ecole';

export interface IPersonnage {
    id: string;
    nom: string;
    userRef: string;
    vies: number;
    niveauReel: number;
    niveauDisponible: number;
    gnEffectif: number;
    alignementRef: Alignement;
    ecoleRef: Ecole;
    raceRef: number;
}

export interface IDisplayPersonnage extends IPersonnage {
    niveauDivin: number;
    niveauProfane: number;
}