import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Don, DonItem } from '../../../../../services/dons/models/don';
import { Choix } from '../../../../../services/personnages/models/choix';

@Component({
    selector: 'creation-progression-dons',
    templateUrl: './dons.component.html'
})
export class JoueurPersonnageCreationProgressionDonsComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;
    @Input() choixPersonnage: Choix[];

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedDons: Don[] = [];
    availableDons = [];
    quantity = [];
    currentIndex: number = 0;

    ngOnInit() {
        this.getAvailableDons();

        // Get the amount of dons to choose
        if (this.choixPersonnage) {
            this.choixPersonnage.forEach((choix) => {
                if (choix.type == 'don' && choix.categorie == 'Normal' && choix.quantite > 0) {
                    this.quantity.push(Array(choix.quantite).fill(1).map((x, i) => i)); // Crée un array de la quantité de choix [1,2,3,...]
                }
            });
        }

    }

    isCompleted(): boolean {

        if (this.selectedDons && this.selectedDons.length == this.quantity.length) {
            return true;
        }

        return false;

    }

    getAvailableDons() {
        this.personnageService.getAvailableDons(this.personnage).then(response => {
            this.availableDons[this.currentIndex] = response;
        });
    }

    setDon(index) {

        // Set Current Index
        this.currentIndex = index + 1;

        // Set Current don
        if (!this.personnage.dons) this.personnage.dons = [];

        const selectedDonItem: DonItem = new DonItem();
        selectedDonItem.don = this.selectedDons[index];
        selectedDonItem.donRef = this.selectedDons[index].id;
        selectedDonItem.niveauObtention = this.personnage.niveauReel;

        this.personnage.dons.push(selectedDonItem);

        // Refresh List of Available dons
        this.getAvailableDons();

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