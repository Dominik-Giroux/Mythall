import { Component } from '@angular/core';

import { AuthenticationService } from '../../../../services/@core/authentication.service';
import { User } from '../../../../services/@core/models/user';

import { PersonnageService } from '../../../../services/personnages/personnage.service';
import { Personnage } from '../../../../services/personnages/models/personnage';

@Component({
  selector: 'app-joueur-personnages-list',
  templateUrl: './list.component.html'
})
export class JoueurPersonnagesListComponent {

  constructor(
    private auth: AuthenticationService,
    private personnageService: PersonnageService
  ){  }

  public user: User;
  public personnages: Personnage[] = [];

  ngOnInit(){
    this.auth.user.subscribe(response => {
      this.user = response;
      this.personnageService.getPersonnagesByUser(this.user.uid).subscribe(response => {
        this.personnages = new Array();
        for(var i = 0; i < response.length; i++){
          var personnage: Personnage = new Personnage();
          personnage = this.personnageService.mapDefault(response[i]);
          this.personnages.push(personnage);
        }
      });
    });
  }

}
