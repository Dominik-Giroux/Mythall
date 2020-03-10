import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Esprit } from '../../../../../services/esprits/models/esprit';

@Component({
    selector: 'creation-progression-esprits',
    templateUrl: './esprit.component.html'
})
export class JoueurPersonnageCreationProgressionEspritComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedEsprit: Esprit;
    availableEsprits: Esprit[] = [];

    ngOnInit() {
        this.getAvailableEsprits();
    }

    isCompleted(): boolean {

        if (this.selectedEsprit) {
            return true;
        }

        return false;

    }

    getAvailableEsprits() {
        this.personnageService.getAvailableEsprits(this.personnage).then(response => {
            this.availableEsprits = response;
        });
    }


    setEsprit() {
        this.personnage.espritRef = this.selectedEsprit.id;
        this.personnage.esprit = this.selectedEsprit;
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