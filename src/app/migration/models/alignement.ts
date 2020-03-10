export enum Alignement {
    loyalBon = 'Loyal Bon',
    neutreBon = 'Neutre Bon',
    chaotiqueBon = 'Chaotique Bon',
    loyalNeutre = 'Loyal Neutre',
    neutreNeutre = 'Neutre Stricte',
    chaotiqueNeutre = 'Chaotique Neutre',
    loyalMauvais = 'Loyal Mauvais',
    neutreMauvais = 'Neutre Mauvais',
    chaotiqueMauvais = 'Chaotique Mauvais',
}

export interface IDisplayAlignement {
    name: Alignement;
    description: string;
}