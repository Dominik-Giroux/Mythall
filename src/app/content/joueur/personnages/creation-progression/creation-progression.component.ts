import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Services
import { AuthenticationService } from '../../../../services/@core/authentication.service';
import { PersonnageService } from '../../../../services/personnages/personnage.service';

//Models
import { Personnage } from '../../../../services/personnages/models/personnage';
import { ClasseItem } from '../../../../services/classes/models/classe';
import { MatStepper } from '@angular/material/stepper';
import { Choix } from '../../../../services/personnages/models/choix';

@Component({
    selector: 'app-joueur-personnages-creation-progression',
    templateUrl: './creation-progression.component.html',
    styleUrls: ['./creation-progression.component.scss']
})
export class JoueurPersonnageCreationProgressionComponent implements OnInit {

    constructor(
        private auth: AuthenticationService,
        private personnageService: PersonnageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    @ViewChild('stepper') stepper: MatStepper;

    progression: boolean = false;
    personnage: Personnage = new Personnage();
    personnageLoaded: boolean = false;
    selectedClasse: ClasseItem;
    choixPersonnage: Choix[] = [];

    // Steps Existing
    ajustementNiveau: boolean = false;
    stepAlignementExist: boolean = false;
    stepConnaissancesExist: boolean = false;
    stepDieuExist: boolean = false;
    stepDonsExist: boolean = false;
    stepDomainesExist: boolean = false;
    stepEcoleExist: boolean = false;
    stepEspritExist: boolean = false;
    stepFourberiesExist: boolean = false;
    stepOrdreExist: boolean = false;
    stepSortsExist: boolean = false;
    stepSortsDomaineExist: boolean = false;

    // Steps Completed
    stepAlignementCompleted: boolean = false;
    stepRaceCompleted: boolean = false;
    stepClassesCompleted: boolean = false;
    stepConnaissancesCompleted: boolean = false;
    stepDieuCompleted: boolean = false;
    stepDonsCompleted: boolean = false;
    stepDomainesCompleted: boolean = false;
    stepEcoleCompleted: boolean = false;
    stepEspritCompleted: boolean = false;
    stepFourberiesCompleted: boolean = false;
    stepOrdreCompleted: boolean = false;
    stepSortsCompleted: boolean = false;
    stepSortsDomaineCompleted: boolean = false;

    ngOnInit() {
        this.getPersonnage();
    }

    getPersonnage() {
        this.route.params.subscribe(param => {
            if (param && param.id) {
                this.personnageService.getPersonnage(param.id).subscribe(personnage => {
                    this.personnageService.buildPromise(personnage).then(personnage => {

                        // Set Personnage
                        this.personnage = personnage;

                        // Niveau d'ajustement
                        if (this.personnage.gnEffectif < (+this.personnage.race.ajustement + 1)) {

                            // Skip la progression
                            this.ajustementNiveau = true;

                            // Donne le niveau d'ajustement
                            this.personnage.gnEffectif += 1;

                        }

                        this.personnageLoaded = true;
                        this.progression = true;

                    });
                })
            } else {

                //Set Personnage User
                this.auth.user.subscribe(response => {
                    this.personnage.userRef = response.uid;
                })

                // Alignement exist if creation
                if (!this.progression) {
                    this.stepAlignementExist = true;
                    this.stepDieuExist = true;
                }

                this.personnageLoaded = true;

            }
        })
    }

    getChoixPersonnage() {

        // Get Choix
        this.personnageService.getChoixPersonnage(this.personnage, this.selectedClasse).then(listChoix => {

            // Set Choix
            this.choixPersonnage = listChoix;
            console.log(this.choixPersonnage);

            // Determine which steps exists
            listChoix.forEach(choix => {

                if (choix.type == 'domaine' && choix.quantite > 0) {
                    this.stepDomainesExist = true;
                }

                if (choix.type == 'ecole' && choix.quantite > 0) {
                    this.stepEcoleExist = true;
                }

                if (choix.type == 'esprit' && choix.quantite > 0) {
                    this.stepEspritExist = true;
                }

                if (choix.type == 'ordre' && choix.quantite > 0) {
                    this.stepOrdreExist = true;
                }

                if (choix.type == 'don' && choix.categorie == 'Connaissance' && choix.quantite > 0) {
                    this.stepConnaissancesExist = true;
                }

                if (choix.type == 'don' && choix.categorie == 'Normal' && choix.quantite > 0) {
                    this.stepDonsExist = true;
                }

                if (choix.type == 'fourberie' && choix.quantite > 0) {
                    this.stepFourberiesExist = true;
                }

                if (choix.type == 'sort' && choix.quantite > 0 && !choix.domaine) {
                    this.stepSortsExist = true;
                }

                if (choix.type == 'sort' && choix.quantite > 0 && choix.domaine) {
                    this.stepSortsDomaineExist = true;
                }

            });

            setTimeout(() => this.stepper.next());

        });

    }

    save() {
        if (this.progression) {
            this.personnageService.updatePersonnage(this.personnage.id, this.personnage.saveState()).then(result => {
                this.router.navigate(['/joueur/personnage/' + this.personnage.id]);
            });
        } else {
            this.personnageService.addPersonnage(this.personnage.saveState()).then(result => {
                this.router.navigate(['/joueur/personnages']);
            });
        }
    }

    // Step Events
    stepClasseCompletedEvent(event) {

        this.stepClassesCompleted = event;

        this.getChoixPersonnage();

    }

    stepDomainesCompletedEvent(event) {

        this.stepDomainesCompleted = event;

        this.getChoixPersonnage();

    }

    stepEcoleCompletedEvent(event) {

        this.stepEcoleCompleted = event;

        this.getChoixPersonnage();

    }

    stepEspritCompletedEvent(event) {

        this.stepEspritCompleted = event;

        this.getChoixPersonnage();

    }

    stepOrdreCompletedEvent(event) {

        this.stepOrdreCompleted = event;

        this.getChoixPersonnage();

    }


    // Step Verifications
    isCurrentStepAlignement() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            return steps;

        }

        return false;
    }

    isCurrentStepDomaines() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;

    }

    isCurrentStepEcole() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;

    }

    isCurrentStepEsprit() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;

    }

    isCurrentStepOrdre() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;

    }

    isCurrentStepConnaissances() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            if (this.stepOrdreExist && !this.stepOrdreCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;
    }

    isCurrentStepDons() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            if (this.stepOrdreExist && !this.stepOrdreCompleted) {
                steps = false;
            }

            if (this.stepConnaissancesExist && !this.stepConnaissancesCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;
    }

    isCurrentStepFourberies() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            if (this.stepOrdreExist && !this.stepOrdreCompleted) {
                steps = false;
            }

            if (this.stepConnaissancesExist && !this.stepConnaissancesCompleted) {
                steps = false;
            }

            if (this.stepDonsExist && !this.stepDonsCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;
    }

    isCurrentStepSorts() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            if (this.stepOrdreExist && !this.stepOrdreCompleted) {
                steps = false;
            }

            if (this.stepConnaissancesExist && !this.stepConnaissancesCompleted) {
                steps = false;
            }

            if (this.stepDonsExist && !this.stepDonsCompleted) {
                steps = false;
            }

            if (this.stepFourberiesExist && !this.stepFourberiesCompleted) {
                steps = false;
            }

            return steps;

        }

        return false;
    }

    isCurrentStepSortsDomaine() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            if (this.stepOrdreExist && !this.stepOrdreCompleted) {
                steps = false;
            }

            if (this.stepConnaissancesExist && !this.stepConnaissancesCompleted) {
                steps = false;
            }

            if (this.stepDonsExist && !this.stepDonsCompleted) {
                steps = false;
            }

            if (this.stepFourberiesExist && !this.stepFourberiesCompleted) {
                steps = false;
            }

            if(this.stepSortsExist && !this.stepSortsCompleted){
                steps = false;
            }

            return steps;

        }

        return false;
    }

    isCurrentStepDieu() {

        if (this.stepClassesCompleted) {

            let steps: boolean = true;

            if (this.stepAlignementExist && !this.stepAlignementCompleted) {
                steps = false;
            }

            if (this.stepDomainesExist && !this.stepDomainesCompleted) {
                steps = false;
            }

            if (this.stepEcoleExist && !this.stepEcoleCompleted) {
                steps = false;
            }

            if (this.stepEspritExist && !this.stepEspritCompleted) {
                steps = false;
            }

            if (this.stepOrdreExist && !this.stepOrdreCompleted) {
                steps = false;
            }

            if (this.stepConnaissancesExist && !this.stepConnaissancesCompleted) {
                steps = false;
            }

            if (this.stepDonsExist && !this.stepDonsCompleted) {
                steps = false;
            }

            if (this.stepFourberiesExist && !this.stepFourberiesCompleted) {
                steps = false;
            }

            if (this.stepSortsExist && !this.stepSortsCompleted) {
                steps = false;
            }

            if (this.stepSortsDomaineExist && !this.stepSortsDomaineCompleted){
                steps = false;
            }

            return steps;

        }

        return false;
    }

}