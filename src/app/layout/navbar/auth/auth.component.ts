import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { IUser } from '../../../services/user.service';

@Component({
  selector: 'app-navbar-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class NavbarAuthComponent implements OnInit {

  constructor(
    public auth: AuthenticationService
  ) { }

  user: IUser;

  ngOnInit() {
    this._getUser();
  }

  public async _getUser(): Promise<void> {
    this.user = await this.auth.user();
  }

}
