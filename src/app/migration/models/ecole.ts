export enum Ecole {
    abjuration = 'Abjuration',
    conjuration = 'Conjuration',
    divination = 'Divination',
    enchantement = 'Enchantement',
    evocation = 'Évocation',
    general = 'Général',
    illusion = 'Illusion',
    invocation = 'Invocation',
    necromancie = 'Nécromancie',
    transmutation = 'Transmutation',   
}

export interface IDisplayEcole {
    name: Ecole;
    description: string;
}