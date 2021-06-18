import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { IUser } from '../../services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})

export class SidenavComponent implements OnInit {

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