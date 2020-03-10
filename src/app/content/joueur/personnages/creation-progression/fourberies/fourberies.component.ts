import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Fourberie, FourberieItem } from '../../../../../services/fourberies/models/fourberie';
import { Choix } from '../../../../../services/personnages/models/choix';

@Component({
    selector: 'creation-progression-fourberies',
    templateUrl: './fourberies.component.html'
})
export class JoueurPersonnageCreationProgressionFourberiesComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;
    @Input() choixPersonnage: Choix[];

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedFourberies: Fourberie[] = [];
    availableFourberies = [];
    quantity = [];
    currentIndex: number = 0;

    ngOnInit() {
        this.getAvailableFourberies();

        // Get the amount of fourberies to choose
        if (this.choixPersonnage) {
            this.choixPersonnage.forEach((choix) => {
                if (choix.type == 'fourberie' && choix.quantite > 0) {
                    this.quantity.push(Array(choix.quantite).fill(1).map((x, i) => i)); // Crée un array de la quantité de choix [1,2,3,...]
                }
            });
        }

    }

    isCompleted(): boolean {

        if (this.selectedFourberies && this.selectedFourberies.length == this.quantity.length) {
            return true;
        }

        return false;

    }

    getAvailableFourberies() {
        this.personnageService.getAvailableFourberies(this.personnage).then(response => {
            this.availableFourberies[this.currentIndex] = response;
        });
    }

    setFourberie(index) {

        // Set Current Index
        this.currentIndex = index + 1;

        // Set Current fourberie
        if (!this.personnage.fourberies) this.personnage.fourberies = [];

        const selectedFourberieItem: FourberieItem = new FourberieItem();
        selectedFourberieItem.fourberie = this.selectedFourberies[index];
        selectedFourberieItem.fourberieRef = this.selectedFourberies[index].id;
        selectedFourberieItem.niveauObtention = this.personnage.niveauReel;

        this.personnage.fourberies.push(selectedFourberieItem);

        // Refresh List of Available fourberies
        this.getAvailableFourberies();

    }

    next() {
        if (this.isCompleted()) {

            // Rebuild Personnage
            this.personnageService.buildPromise(this.personnage).then(personnage => {

                // Emit & Allow next step
                this.personnageChange.emit(personnage);
                this.completedChange.emit(true);
                setTimeout(() => {
                    this.stepper.next();
                });

            });

        }
    }

}