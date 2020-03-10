import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthenticationService } from '../../../../services/@core/authentication.service';
import { ClasseService } from '../../../../services/classes/classe.service';
import { PersonnageService } from '../../../../services/personnages/personnage.service';
import { Personnage } from '../../../../services/personnages/models/personnage';
import { DonItem } from '../../../../services/dons/models/don';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../services/@core/user.service';
import { User } from '../../../../services/@core/models/user';

@Component({
  selector: 'app-joueur-fiche-personnage',
  templateUrl: './fiche.component.html'
})
export class JoueurPersonnageFicheComponent implements OnInit, OnDestroy {

  constructor(
    public auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private classeService: ClasseService,
    private personnageService: PersonnageService,
    private router: Router,
    private userService: UserService
  ) { }

  id: string;
  personnage: Personnage = new Personnage();
  user: User;
  private subscription: Subscription;
  // capaciteSpeciale: boolean = false;

  ngOnInit() {
    this.getPersonnage();
    this.getUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPersonnage() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.subscription = this.personnageService.getPersonnage(params['id']).subscribe(response => {
          this.personnageService.buildPromise(response).then(personnage => {
            this.personnage = personnage;
          })
        })
      }
    });
  }

  getUser() {
    this.auth.user.subscribe(response => {

      this.user = response

    });
  }

}
