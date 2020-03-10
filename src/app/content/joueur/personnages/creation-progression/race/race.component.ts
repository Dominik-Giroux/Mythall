import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { AuthenticationService } from '../../../../../services/@core/authentication.service';
import { Personnage } from '../../../../../services/personnages/models/personnage';
import { RaceService } from '../../../../../services/races/race.service';
import { Race } from '../../../../../services/races/models/race';
import { UserService } from '../../../../../services/@core/user.service';
import { User } from '../../../../../services/@core/models/user';


@Component({
    selector: 'creation-progression-race',
    templateUrl: './race.component.html'
})
export class JoueurPersonnageCreationProgressionRaceComponent implements OnInit {

    constructor(
        public auth: AuthenticationService,
        private raceService: RaceService,
        private userService: UserService
    ) { }

    @Input() stepper: MatStepper;
    @Input() progression: boolean;
    @Input() personnage: Personnage;

    @Output() personnageChange: EventEmitter<Personnage> = new EventEmitter<Personnage>();
    @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedRace: Race;
    races: Race[];
    user: User;
    users: User[];

    ngOnInit() {

        this.auth.user.subscribe(response => {

            this.user = response

            if (this.auth.isAnimateur(this.user)) {
                this.getUsers();
            }

        });

        this.getRaces();

        

        if (this.personnage.race) {
            this.selectedRace = this.personnage.race;
        }

    }

    isCompleted(): boolean {

        if (this.personnage.nom && this.personnage.raceRef) {
            return true;
        }

        return false;

    }

    getUsers()  {
        this.userService.getUsers().subscribe(response => {
            this.users = response;
        });
    }

    getRaces() {
        this.raceService.getRaces().subscribe(response => {
            this.races = response;
        });
    }

    setRace() {
        if (!this.progression) {
            this.personnage.raceRef = this.selectedRace.id;
            this.personnage.race = this.selectedRace;
        }
    }

    next() {
        if (this.isCompleted()) {
            this.personnageChange.emit(this.personnage);
            this.completedChange.emit(true);
            setTimeout(() => { this.stepper.next() });
        }
    }

}