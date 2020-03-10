import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/@core/authentication.service';
import { User } from '../../../services/@core/models/user';

@Component({
  selector: 'app-navbar-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class NavbarAuthComponent implements OnInit {

  constructor(
    public auth: AuthenticationService
  ){  }

  public user: User;

  ngOnInit() {
    this.auth.user.subscribe(response => this.user = response);
  }

}
