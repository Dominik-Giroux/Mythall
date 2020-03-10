import { Component, OnInit } from '@angular/core';

import { DonService } from '../../../services/dons/don.service';
import { Don } from '../../../services/dons/models/don';

@Component({
  selector: 'app-jeu-dons',
  templateUrl: './dons.component.html',
  styleUrls: ['./dons.component.scss']
})
export class JeuDonsComponent implements OnInit {

  constructor(
    private donService: DonService
  ){}

  dons: Don[];

  ngOnInit(){

    // Get Dons
    this.donService.getDons().subscribe(response => {
      this.dons = response;
    });

  }

  scroll(el) {
    console.log(el);
    el.scrollIntoView();
}

}
