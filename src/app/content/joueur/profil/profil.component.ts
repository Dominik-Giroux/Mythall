import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../services/@core/authentication.service';
import { UserService } from '../../../services/@core/user.service';
import { User } from '../../../services/@core/models/user';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  constructor(
    public auth: AuthenticationService,
    private userService: UserService
  ) { }

  user: User;

  ngOnInit() {
    this.auth.user.subscribe(response => {
      this.user = response
    });
  }

}
