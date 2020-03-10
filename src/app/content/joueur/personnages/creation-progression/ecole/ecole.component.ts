import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Ecole } from '../../../../../models/ecole';

@Component({
    selector: 'creation-progression-ecoles',
    templateUrl: './ecole.component.html'
})
export class JoueurPersonnageCreationProgressionEcoleComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedEcole: Ecole;
    availableEcoles: Ecole[] = [];

    ngOnInit() {
        this.getAvailableEcoles();
    }

    isCompleted(): boolean {

        if (this.selectedEcole) {
            return true;
        }

        return false;

    }

    getAvailableEcoles() {
        this.personnageService.getAvailableEcoles(this.personnage).then(response => {
            this.availableEcoles = response;
        });
    }


    setEcole() {
        this.personnage.ecoleRef = this.selectedEcole.id;
        this.personnage.ecole = this.selectedEcole;
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