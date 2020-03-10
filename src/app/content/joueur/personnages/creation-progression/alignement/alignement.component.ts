import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Alignement } from '../../../../../models/alignement';

@Component({
    selector: 'creation-progression-alignements',
    templateUrl: './alignement.component.html'
})
export class JoueurPersonnageCreationProgressionAlignementComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedAlignement: Alignement;
    availableAlignements: Alignement[] = [];

    ngOnInit() {
        this.getAvailableAlignements();
    }

    isCompleted(): boolean {

        if (this.selectedAlignement) {
            return true;
        }

        return false;

    }

    getAvailableAlignements() {
        this.personnageService.getAvailableAlignements(this.personnage).then(response => {
            this.availableAlignements = response;
        });
    }


    setAlignement() {
        this.personnage.alignementRef = this.selectedAlignement.id;
        this.personnage.alignement = this.selectedAlignement;
    }

    next() {
        if (this.isCompleted()) {

            // Rebuild Personnage
            this.personnageService.buildPromise(this.personnage).then(personnage => {

                // Emit & Allow next step
                this.personnageChange.emit(personnage);
                this.completedChange.emit(true);
                setTimeout(()=> {
                    this.stepper.next();
                });
                
            });

        }
    }

}