import { Component, OnInit } from '@angular/core';

import { RaceService } from '../../../services/races/race.service';
import { Race } from '../../../services/races/models/race';

@Component({
  selector: 'app-jeu-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.scss']
})
export class JeuRacesComponent implements OnInit {

  constructor(
    private raceService: RaceService
  ){}

  races: Race[];

  ngOnInit(){
    this.getRaces();
  }

  getRaces(){
    this.raceService.getRaces().subscribe(response => {
      this.races = response;
    });
  }

}
