import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Domaine } from '../../../../../services/domaines/models/domaine';
import { Choix } from '../../../../../services/personnages/models/choix';

@Component({
    selector: 'creation-progression-domaines',
    templateUrl: './domaines.component.html'
})
export class JoueurPersonnageCreationProgressionDomainesComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;
    @Input() choixPersonnage: Choix[];

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedDomaines: Domaine[] = [];
    availableDomaines = [];
    quantity = [];
    currentIndex: number = 0;

    ngOnInit() {
        this.getAvailableDomaines();

        // Get the amount of domaines to choose
        this.choixPersonnage.forEach((choix) => {
            if (choix.type == 'domaine' && choix.quantite > 0) {
                this.quantity = Array(choix.quantite).fill(1).map((x, i) => i); // Crée un array de la quantité de choix [1,2,3,...]
            }
        });

    }

    isCompleted(): boolean {

        if (this.selectedDomaines && this.selectedDomaines.length == this.quantity.length) {
            return true;
        }

        return false;

    }

    getAvailableDomaines() {
        this.personnageService.getAvailableDomaines(this.personnage).then(response => {
            this.availableDomaines[this.currentIndex] = response;
        });
    }

    setDomaine(index) {

        // Set Current Index
        this.currentIndex = index + 1;

        // Set Current domaine
        if (!this.personnage.domaines) this.personnage.domaines = [];
        if (!this.personnage.domainesRef) this.personnage.domainesRef = [];
        
        this.personnage.domaines[index] = this.selectedDomaines[index];
        this.personnage.domainesRef[index] = this.selectedDomaines[index].id;

        // Refresh List of Available domaines
        this.getAvailableDomaines();

    }

    next() {
        if (this.isCompleted()) {

            // Rebuild Personnage
            this.personnageService.buildPromise(this.personnage).then(personnage => {

                // Emit & Allow next step
                this.personnageChange.emit(personnage);
                this.completedChange.emit(true);

            });

        }
    }

}