import { Component } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { PersonnageService, IPersonnage } from '../../../../services/personnage.service';
import { IUser } from '../../../../services/user.service';

@Component({
  selector: 'app-joueur-personnages-list',
  templateUrl: './list.component.html'
})
export class JoueurPersonnagesListComponent {

  constructor(
    private auth: AuthenticationService,
    private personnageService: PersonnageService
  ) { }

  user: IUser;
  personnages: IPersonnage[] = [];

  ngOnInit() {
    this._getPersonnages();
  }

  public async _getUser(): Promise<void> {
    this.user = await this.auth.user();
  }

  private async _getPersonnages(): Promise<void> {
    this.personnages = await this.personnageService.getPersonnages(this.user.uid);
  }

}
