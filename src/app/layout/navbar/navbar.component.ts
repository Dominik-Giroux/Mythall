import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(){ }

  environement = environment;

  @Output() sidenavToggle : EventEmitter<boolean> = new EventEmitter<boolean>(false);


  toggle(){
    this.sidenavToggle.next();
  }

}
