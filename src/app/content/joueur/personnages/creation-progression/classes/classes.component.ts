import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Personnage } from '../../../../../services/personnages/models/personnage';
import { PersonnageService } from '../../../../../services/personnages/personnage.service';
import { Classe, ClasseItem } from '../../../../../services/classes/models/classe';

@Component({
    selector: 'creation-progression-classes',
    templateUrl: './classes.component.html'
})
export class JoueurPersonnageCreationProgressionClassesComponent implements OnInit {

    constructor(
        private personnageService: PersonnageService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() selectedClasseChange: EventEmitter<ClasseItem> = new EventEmitter<ClasseItem>();

    selectedClasse: Classe;
    selectedClasseItem: ClasseItem = new ClasseItem();
    availableClasses: Classe[] = [];
    hideText: boolean = false;

    ngOnInit() {
        this.getAvailableClasses();
    }

    isCompleted(): boolean {

        if (this.selectedClasse) {
            return true;
        }

        return false;

    }

    getAvailableClasses() {
        this.personnageService.getAvailableClasses(this.personnage).then(response => {
            this.availableClasses = response;
            console.log(this.availableClasses);
        });
    }

    levelClasse() {

        this.hideText = true;
        let classeFound: boolean = false;


        // Existing Classe
        this.personnage.classes.forEach(classeItem => {
            if (classeItem.classeRef == this.selectedClasse.id) {
                classeItem.niveau += 1;
                classeFound = true;

                this.selectedClasseItem = classeItem;

            }
        });

        // New Classe
        if (!classeFound) {
            this.selectedClasseItem.classe = this.selectedClasse;
            this.selectedClasseItem.classeRef = this.selectedClasse.id;
            this.personnage.classes.push(this.selectedClasseItem);
        }

    }

    next() {
        if (this.isCompleted()) {

            // Give Level
            this.levelClasse();

            // Rebuild Personnage
            this.personnageService.buildPromise(this.personnage).then(personnage => {

                // Emit & Allow next step
                this.personnageChange.emit(personnage);
                this.selectedClasseChange.emit(this.selectedClasseItem);
                this.completedChange.emit(true);
                
            });

        }
    }

}