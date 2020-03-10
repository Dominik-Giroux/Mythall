import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Ordre } from '../../../../../services/ordres/models/ordre';

@Component({
    selector: 'creation-progression-ordres',
    templateUrl: './ordre.component.html'
})
export class JoueurPersonnageCreationProgressionOrdreComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedOrdre: Ordre;
    availableOrdres: Ordre[] = [];

    ngOnInit() {
        this.getAvailableOrdres();
    }

    isCompleted(): boolean {

        if (this.selectedOrdre) {
            return true;
        }

        return false;

    }

    getAvailableOrdres() {
        this.personnageService.getAvailableOrdres(this.personnage).then(response => {
            this.availableOrdres = response;
        });
    }


    setOrdre() {
        this.personnage.ordresRef.push(this.selectedOrdre.id);
        this.personnage.ordres.push(this.selectedOrdre);
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