import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Sort, SortItem } from '../../../../../services/sorts/models/sort';
import { Choix } from '../../../../../services/personnages/models/choix';

@Component({
    selector: 'creation-progression-sorts',
    templateUrl: './sorts.component.html'
})
export class JoueurPersonnageCreationProgressionSortsComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;
    @Input() choixPersonnage: Choix[];

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedSorts: Sort[] = [];
    availableSorts = [];
    quantity = [];
    currentIndex: number = 0;

    ngOnInit() {
        this.getAvailableSorts();

        // Get the amount of sorts to choose
        if (this.choixPersonnage) {
            this.choixPersonnage.forEach((choix) => {
                if (choix.type == 'sort' && choix.quantite > 0 && !choix.domaine) {
                    this.quantity.push(Array(choix.quantite).fill(1).map((x, i) => i)); // Crée un array de la quantité de choix [1,2,3,...]
                }
            });
        }

    }

    isCompleted(): boolean {

        if (this.selectedSorts && this.selectedSorts.length == this.quantity.length) {
            return true;
        }

        return false;

    }

    getAvailableSorts() {
        this.personnageService.getAvailableSorts(this.personnage).then(response => {
            this.availableSorts[this.currentIndex] = response;
        });
    }

    setSort(index) {

        // Set Current Index
        this.currentIndex = index + 1;

        // Set Current sort
        if (!this.personnage.sorts) this.personnage.sorts = [];

        const selectedSortItem: SortItem = new SortItem();
        selectedSortItem.sort = this.selectedSorts[index];
        selectedSortItem.sortRef = this.selectedSorts[index].id;
        selectedSortItem.niveauObtention = this.personnage.niveauReel;

        this.personnage.sorts.push(selectedSortItem);

        // Refresh List of Available sorts
        this.getAvailableSorts();

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