import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/@core/authentication.service';
import { User } from '../../services/@core/models/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})

export class SidenavComponent implements OnInit { 

  constructor(
    public auth: AuthenticationService
  ){}

  public user: User;

  ngOnInit(){
    this.auth.user.subscribe(response => this.user = response);
  }

}