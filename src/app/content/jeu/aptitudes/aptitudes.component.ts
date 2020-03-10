import { Component, OnInit } from '@angular/core';

import { AptitudeService } from '../../../services/aptitudes/aptitude.service';
import { Aptitude } from '../../../services/aptitudes/models/aptitude';

@Component({
  selector: 'app-jeu-aptitudes',
  templateUrl: './aptitudes.component.html',
  styleUrls: ['./aptitudes.component.scss']
})
export class JeuAptitudesComponent implements OnInit {

  constructor(
    private aptitudeService: AptitudeService
  ){}

  aptitudes: Aptitude[];

  ngOnInit(){

    // Get Aptitudes
    this.aptitudeService.getAptitudes().subscribe(response => {
      this.aptitudes = response;
    });

  }

  scroll(el) {
    console.log(el);
    el.scrollIntoView();
}

}
