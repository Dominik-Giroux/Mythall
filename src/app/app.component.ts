import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private mediaMatcher: MediaMatcher
  ) { }

  @ViewChild("sidenav") sidenav: MatSidenav;
  mediaQueryList;

  ngOnInit(){
    this.mediaQueryList = this.mediaMatcher.matchMedia('(max-width: 768px)');
  }

  sidenavToggle(){
    this.sidenav.toggle();
  }

}
