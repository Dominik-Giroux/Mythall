import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/@core/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  constructor(
    public auth: AuthenticationService
  ) { }

  googleLogin() {
    this.auth.googleLogin();
  }
  facebookLogin() {
    this.auth.facebookLogin();
  }

  logout() {
    this.auth.logout();
  }

}
