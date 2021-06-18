import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { PersonnageService, IPersonnage } from '../../../../services/personnage.service';
import { IUser } from '../../../../services/user.service';

@Component({
  selector: 'app-joueur-fiche-personnage',
  templateUrl: './fiche.component.html'
})
export class JoueurPersonnageFicheComponent implements OnInit {

  constructor(
    public auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private personnageService: PersonnageService,
  ) { }

  id: string;
  user: IUser;
  personnage = {} as IPersonnage;

  ngOnInit() {
    this._getUser();
    this._getPersonnage();
  }

  public async _getUser(): Promise<void> {
    this.user = await this.auth.user();
  }

  private _getPersonnage(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.personnage = await this.personnageService.getPersonnage(params['id']);
        await this.personnageService.buildPersonnage(this.personnage);
      }
    });
  }

}
